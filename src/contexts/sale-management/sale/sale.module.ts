import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SaleOrmEntity } from './infraestructure/persistence/typeorm/entities/sale.orm-entity';
import { SaleController } from './presentation/controllers/sale.controller';
import { RegisterSaleUseCase } from './application/use-cases/register-sale.use-case';
import { SALE_REPOSITORY, SaleRepository } from './domain/repositories/sale.repository';
import { TypeormSaleRepository } from './infraestructure/persistence/typeorm/repositories/typeorm-sale.repository';
import { TypeormSaleCheckerAdapter } from './infraestructure/persistence/typeorm/external-services/typeorm-sale-checker.adapter';
import { ViewAllSaleUseCase } from './application/use-cases/view-all-sale.use-case';
import { DeletePaymentMethodUseCase } from './application/use-cases/delete-payment-method.use-case';
import { SALE_CHECKER_PORT, SaleCheckerPort } from './domain/ports/out/sale-checker.port';
import { BranchOfficeModule } from 'src/contexts/establishment-management/branch-office/branch-office.module';
import { CustomerModule } from '../customer/customer.module';
import { ProductModule } from 'src/contexts/product-management/product/product.module';
import { BRANCH_OFFICE_CHECKER_PORT, BranchOfficeCheckerPort } from 'src/contexts/establishment-management/branch-office/domain/ports/out/branch-office-checker.port';
import { CUSTOMER_CHECKER_PORT, CustomerCheckerPort } from '../customer/domain/ports/out/customer-checker-port';
import { EMPLOYEE_CHECKER_PORT, EmployeeChekerPort } from 'src/contexts/employee-management/employee/domain/ports/out/employee-checker.port';
import { InventoryModule } from 'src/contexts/inventory-management/inventory/inventory.module';
import { SALE_DETAIL_REPOSITORY, SaleDetailRepository } from '../sale-detail/domain/repositories/sale-detail.repository';
import { TypeormSaleDetailRepository } from '../sale-detail/infraestructure/persistence/typeorm/repositories/typeorm-sale-detail.repository';
import { RegisterSaleDetailUseCase } from '../sale-detail/application/use-case/register-sale-detail.use-case';
import { INVENTORY_REPOSITORY, InventoryRepository } from 'src/contexts/inventory-management/inventory/domain/repositories/inventory.repository';
import { SaleDetailOrmEntity } from '../sale-detail/infraestructure/persistence/typeorm/entities/sale-detail.orm-entity';
import { ProductRepository } from 'src/contexts/product-management/product/domain/repositories/product.repository';
import { FindByIdSaleUseCase } from './application/use-cases/find-by-id-sale.use-case';
import { SalePaymentModule } from '../sale-payment/sale-payment.module';
import { PhysicalDeleteSaleDetailUseCase } from '../sale-detail/application/use-case/physical-delete-sale-detail.use-case';
import { ModifyQuantitySaleDetailUseCase } from '../sale-detail/application/use-case/modify-quantity-sale-detail.use-case';
import { CalculateSaleUseCase } from './application/use-cases/calculate-sale.use-case';
import { FindAllByBranchOfficeSaleUseCase } from './application/use-cases/find-all-by-branch-office-sale.use-case';
import { FindFinishSaleByIdUseCase } from './application/use-cases/find-finish-sale-by-id.use-case';
import { EmployeeSharedModule } from 'src/contexts/employee-management/employee/employee-shared.module';
import { DiscountInventoryItemUseCase } from 'src/contexts/inventory-management/inventory-item/application/use-case/discount-inventory-item.use-case';
import { INVENTORY_ITEM_REPOSITORY, InventoryItemRepository } from 'src/contexts/inventory-management/inventory-item/domain/repositories/inventory-item.repository';
import { CashModule } from 'src/contexts/cash-management/cash.module';
import { CASH_SESSION_REPOSITORY, CashSessionRepository } from 'src/contexts/cash-management/cash-session/domain/repositories/cash-session.repository';
import { ConnectionDBModule } from 'src/config/database/typeorm/connection/connection-db.module';
import { CONNECTION_DB_REPOSITORIO, ConnectionDBRepository } from 'src/config/database/typeorm/connection/domain/repositories/connection-repository';
import { RegisterSalePaymentUseCase } from '../sale-payment/application/use-cases/register-sale-payment.use-case';

@Module({
  imports: [
    TypeOrmModule.forFeature([SaleOrmEntity, SaleDetailOrmEntity]),
    BranchOfficeModule,
    EmployeeSharedModule,
    CustomerModule,
    ProductModule,
    InventoryModule,
    CashModule,
    ConnectionDBModule,
    forwardRef(() => SalePaymentModule),
  ],
  controllers: [SaleController],
  providers: [
    {
        provide: SALE_REPOSITORY,
        useClass: TypeormSaleRepository
    },
    {
      provide: SALE_CHECKER_PORT,
      useClass: TypeormSaleCheckerAdapter
    },
    {
      provide: SALE_DETAIL_REPOSITORY,
      useClass: TypeormSaleDetailRepository
    },
    {
      provide: RegisterSaleDetailUseCase,
      useFactory: (
        saleDetailRepo: SaleDetailRepository, 
        saleCheckerPort: SaleCheckerPort,
        saleRepo: ProductRepository,
        inventoryRepo: InventoryRepository )=>{
        return new RegisterSaleDetailUseCase(saleDetailRepo, saleCheckerPort, inventoryRepo);
      },
      inject: [
        SALE_DETAIL_REPOSITORY,
        SALE_CHECKER_PORT,
        SALE_REPOSITORY,
        INVENTORY_REPOSITORY,
      ]
    },
    {
      provide: PhysicalDeleteSaleDetailUseCase,
      useFactory: (repo: SaleDetailRepository, saleCheckerPort: SaleCheckerPort)=>{
        return new PhysicalDeleteSaleDetailUseCase(repo, saleCheckerPort);
      },
      inject:[ SALE_DETAIL_REPOSITORY, SALE_CHECKER_PORT ]
    },
    {
      provide: ModifyQuantitySaleDetailUseCase,
      useFactory: (repo: SaleDetailRepository, saleCheckerPort: SaleCheckerPort)=>{
        return new ModifyQuantitySaleDetailUseCase(repo, saleCheckerPort);
      },
      inject:[ SALE_DETAIL_REPOSITORY, SALE_CHECKER_PORT ]
    },
    {
      provide: RegisterSaleUseCase, // Provee el caso de uso
      useFactory: (
        repo: SaleRepository, 
        branchChecker: BranchOfficeCheckerPort, 
        customerChecker: CustomerCheckerPort,
        employeeChecker: EmployeeChekerPort,
        cashSessionRepo: CashSessionRepository,
        connection: ConnectionDBRepository) => {
        // NestJS inyecta el repo aquí basado en el token
        return new RegisterSaleUseCase(
          repo, branchChecker, customerChecker, employeeChecker, cashSessionRepo, connection
        );
      },
      inject: [
        SALE_REPOSITORY,
        BRANCH_OFFICE_CHECKER_PORT,
        CUSTOMER_CHECKER_PORT,
        EMPLOYEE_CHECKER_PORT,
        CASH_SESSION_REPOSITORY,
        CONNECTION_DB_REPOSITORIO
      ], // Declara la dependencia para el factory
    },
    {
      provide: ViewAllSaleUseCase,
      useFactory: (repository: SaleRepository)=>{
        return new ViewAllSaleUseCase(repository);
      },
      inject: [SALE_REPOSITORY]
    },
    {
      provide: FindByIdSaleUseCase,
      useFactory: (repository: SaleRepository)=>{
        return new FindByIdSaleUseCase(repository);
      },
      inject: [SALE_REPOSITORY]
    },
    {
      provide: FindFinishSaleByIdUseCase,
      useFactory: (repository: SaleRepository)=>{
        return new FindFinishSaleByIdUseCase(repository);
      },
      inject: [SALE_REPOSITORY]
    },
    {
      provide: FindAllByBranchOfficeSaleUseCase,
      useFactory: (repository: SaleRepository)=>{
        return new FindAllByBranchOfficeSaleUseCase(repository);
      },
      inject: [SALE_REPOSITORY]
    },
    {
      provide: DeletePaymentMethodUseCase,
      useFactory: (repository: SaleRepository) => {
        return new DeletePaymentMethodUseCase(repository);
      },
      inject: [SALE_REPOSITORY]
    },
    {
      provide: CalculateSaleUseCase,
      useFactory: (
        repository: SaleRepository,
        employeeChecker: EmployeeChekerPort, 
        customerChecker: CustomerCheckerPort,
        invRepo: InventoryItemRepository,
        descounrInvUseCase: DiscountInventoryItemUseCase,
        cashSessionRepo: CashSessionRepository,
        registerSalePaymentUseCase: RegisterSalePaymentUseCase,
        connection: ConnectionDBRepository,
      ) => {
        return new CalculateSaleUseCase(
          repository, 
          employeeChecker, 
          customerChecker, 
          invRepo, 
          descounrInvUseCase, 
          cashSessionRepo,
          registerSalePaymentUseCase,
          connection
        );
      },
      inject: [
        SALE_REPOSITORY,
        EMPLOYEE_CHECKER_PORT, 
        CUSTOMER_CHECKER_PORT,
        INVENTORY_ITEM_REPOSITORY,
        DiscountInventoryItemUseCase,
        CASH_SESSION_REPOSITORY,
        RegisterSalePaymentUseCase,
        CONNECTION_DB_REPOSITORIO,
      ]
    },
  ],
  exports: [
    SALE_CHECKER_PORT,
    SALE_REPOSITORY,
    SALE_DETAIL_REPOSITORY
  ]
})
export class SaleModule {}
