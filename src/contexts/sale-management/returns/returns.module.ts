import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ReturnsOrmEntity } from "./infraestructure/entities/returns.orm-entity";
import { RETURNS_REPOSITORY, ReturnsRepository } from "./domain/repositories/returns.repository";
import { TypeormReturnsRepository } from "./infraestructure/repositories/typeorm-returns.repository";
import { ReturnsProductsUseCase } from "./application/use-cases/returns-products.use-case";
import { CONNECTION_DB_REPOSITORIO, ConnectionDBRepository } from "src/config/database/typeorm/connection/domain/repositories/connection-repository";
import { ConnectionDBModule } from "src/config/database/typeorm/connection/connection-db.module";
import { EmployeeModule } from "src/contexts/employee-management/employee/employee.module";
import { EMPLOYEE_REPOSITORY, EmployeeRepository } from "src/contexts/employee-management/employee/domain/repositories/employee.repository";
import { INVENTORY_REPOSITORY, InventoryRepository } from "src/contexts/inventory-management/inventory/domain/repositories/inventory.repository";
import { InventoryModule } from "src/contexts/inventory-management/inventory/inventory.module";
import { SALE_DETAIL_REPOSITORY, SaleDetailRepository } from "../sale-detail/domain/repositories/sale-detail.repository";
import { INVENTORY_ITEM_REPOSITORY, InventoryItemRepository } from "src/contexts/inventory-management/inventory-item/domain/repositories/inventory-item.repository";
import { TRANSACTION_REPOSITORY, TransactionRepository } from "src/contexts/transaction-management/transaction/domain/repositories/transaction.repository";
import { TransactionModule } from "src/contexts/transaction-management/transaction/transaction.module";
import { SaleModule } from "../sale/sale.module";
import { ReturnsController } from "./presentation/constrollers/returns.controller";
import { FindReturnsByBranchOfficeUseCase } from "./application/use-cases/find-returns-by-branch-office.use-cases";

@Module({
    imports:[
        TypeOrmModule.forFeature([ReturnsOrmEntity]),
        ConnectionDBModule,
        EmployeeModule,
        InventoryModule,
        SaleModule,
        TransactionModule,
    ],
    providers:[
        {
            provide: RETURNS_REPOSITORY,
            useClass: TypeormReturnsRepository
        },
        {
            provide: ReturnsProductsUseCase,
            useFactory: (
                    returnsRepo: ReturnsRepository, employeeRepo: EmployeeRepository, inventoryRepo: InventoryRepository,
                    inventoryItemRepo: InventoryItemRepository, saleDetailRepo: SaleDetailRepository, transactionRepo: TransactionRepository,
                    connection: ConnectionDBRepository)=> {
                return new ReturnsProductsUseCase(
                    returnsRepo, employeeRepo, inventoryRepo, inventoryItemRepo ,saleDetailRepo, transactionRepo, connection);
            },
            inject:[
                RETURNS_REPOSITORY,
                EMPLOYEE_REPOSITORY,
                INVENTORY_REPOSITORY,
                INVENTORY_ITEM_REPOSITORY,
                SALE_DETAIL_REPOSITORY,
                TRANSACTION_REPOSITORY,
                CONNECTION_DB_REPOSITORIO
            ]
        },
        {
            provide: FindReturnsByBranchOfficeUseCase,
            useFactory: (repo: ReturnsRepository)=> {
                return new FindReturnsByBranchOfficeUseCase(repo)
            },
            inject:[
                RETURNS_REPOSITORY
            ]
        }
    ],
    controllers: [
        ReturnsController
    ]
})
export class ReturnsModule{}