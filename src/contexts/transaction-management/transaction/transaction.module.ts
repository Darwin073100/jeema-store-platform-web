import { forwardRef, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TransactionOrmEntity } from "./infraestructure/entities/transaction.orm-entity";
import { TransactionTypeOrmEntity } from "../transaction-type/infraestructure/entities/transaction-type.orm-entity";
import { TypeormTransactionTypeRepository } from "../transaction-type/infraestructure/repositories/typeorm-transaction-type.repository";
import { TRANSACTION_TYPE_REPOSITORY, TransactionTypeRepository } from "../transaction-type/domain/repositories/transaction-type.repository";
import { TRANSACTION_REPOSITORY, TransactionRepository } from "./domain/repositories/transaction.repository";
import { TypeormTransactionRepository } from "./infraestructure/repositories/typeorm-transaction.repository";
import { RegisterTransactionSale } from "./application/use-cases/register-transaction-sale.use-case";
import { BRANCH_OFFICE_REPOSITORY, BranchOfficeRepository } from "src/contexts/establishment-management/branch-office/domain/repositories/branch-office.repository";
import { SALE_REPOSITORY, SaleRepository } from "src/contexts/sale-management/sale/domain/repositories/sale.repository";
import { EMPLOYEE_REPOSITORY, EmployeeRepository } from "src/contexts/employee-management/employee/domain/repositories/employee.repository";
import { BranchOfficeModule } from "src/contexts/establishment-management/branch-office/branch-office.module";
import { EmployeeModule } from "src/contexts/employee-management/employee/employee.module";
import { SaleModule } from "src/contexts/sale-management/sale/sale.module";
import { TransactionController } from "./presentation/controllers/transaction.controller";
import { FindAllManyFilterTransactionsUseCase } from "./application/use-cases/find-all-many-filter-transactions.use-case";
import { ConnectionDBModule } from "src/config/database/typeorm/connection/connection-db.module";
import { RegisterTransactionUseCase } from "./application/use-cases/register-transaction.use-case";
import { CASH_SESSION_REPOSITORY, CashSessionRepository } from "src/contexts/cash-management/cash-session/domain/repositories/cash-session.repository";
import { CashModule } from "src/contexts/cash-management/cash.module";
import { FindAllTransactionsTypeUseCase } from "../transaction-type/applications/use-cases/find-all-transactions-type.use-case";

@Module({
    imports:[
        TypeOrmModule.forFeature([
            TransactionOrmEntity,
            TransactionTypeOrmEntity
        ]),
        CashModule,
        forwardRef(()=> SaleModule),
        EmployeeModule,
        BranchOfficeModule,
        ConnectionDBModule,
    ],
    providers:[
        {
            provide: TRANSACTION_TYPE_REPOSITORY,
            useClass: TypeormTransactionTypeRepository
        },
        {
            provide: TRANSACTION_REPOSITORY,
            useClass: TypeormTransactionRepository
        },
        {
            provide: RegisterTransactionSale,
            useFactory: (
                repo1: TransactionRepository, repo2: TransactionTypeRepository, 
                repo3: BranchOfficeRepository, repo4: SaleRepository, repo5: EmployeeRepository)=> {
                return new RegisterTransactionSale(repo1, repo2, repo3, repo4, repo5)
            },
            inject:[
                TRANSACTION_REPOSITORY, TRANSACTION_TYPE_REPOSITORY, BRANCH_OFFICE_REPOSITORY, SALE_REPOSITORY, EMPLOYEE_REPOSITORY
            ]
        },
        {
            provide: RegisterTransactionUseCase,
            useFactory: (
                repo1: TransactionRepository, repo2: TransactionTypeRepository, 
                repo3: BranchOfficeRepository, repo4: SaleRepository, repo5: EmployeeRepository,
                repo6: CashSessionRepository,
            )=> {
                return new RegisterTransactionUseCase(repo1, repo2, repo3, repo4, repo5, repo6)
            },
            inject:[
                TRANSACTION_REPOSITORY, TRANSACTION_TYPE_REPOSITORY, BRANCH_OFFICE_REPOSITORY, 
                SALE_REPOSITORY, EMPLOYEE_REPOSITORY, CASH_SESSION_REPOSITORY
            ]
        },
        {
            provide: FindAllManyFilterTransactionsUseCase,
            useFactory: (transactionRepo: TransactionRepository)=> {
                return new FindAllManyFilterTransactionsUseCase(transactionRepo);
            },
            inject:[
                TRANSACTION_REPOSITORY
            ]
        },
        {
            provide: FindAllTransactionsTypeUseCase,
            useFactory: (transactionRepo: TransactionTypeRepository)=> {
                return new FindAllTransactionsTypeUseCase(transactionRepo);
            },
            inject:[
                TRANSACTION_TYPE_REPOSITORY
            ]
        },
    ],
    exports:[
        TRANSACTION_REPOSITORY,
        TRANSACTION_TYPE_REPOSITORY,
    ],
    controllers:[
        TransactionController
    ]
})
export class TransactionModule{}