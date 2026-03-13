import { forwardRef, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CashRegisterOrmEntity } from "./cash-register/infraestructure/entities/cash-register.orm-entity";
import { CASH_REGISTER_REPOSITORY, CashRegisterRepository } from "./cash-register/domain/repositories/cash-register.repository";
import { TypeormCashRegisterRepository } from "./cash-register/infraestructure/repositories/typeorm-cash-register.repository";
import { BranchOfficeModule } from "../establishment-management/branch-office/branch-office.module";
import { RegisterCashRegisterUseCase } from "./cash-register/application/use-cases/register-cash-register.use-case";
import { BRANCH_OFFICE_REPOSITORY, BranchOfficeRepository } from "../establishment-management/branch-office/domain/repositories/branch-office.repository";
import { CashRegisterController } from "./cash-register/presentation/constrollers/cash-register.controller";
import { CashSessionOrmEntity } from "./cash-session/infraestructure/entities/cash-session.orm-entity";
import { CASH_SESSION_REPOSITORY, CashSessionRepository } from "./cash-session/domain/repositories/cash-session.repository";
import { TypeormCashSessionRepository } from "./cash-session/infraestructure/repositories/typeorm-cash-session.repository";
import { OpenCashSessionUseCase } from "./cash-session/application/use-cases/open-cash-session.use-case";
import { EMPLOYEE_REPOSITORY, EmployeeRepository } from "../employee-management/employee/domain/repositories/employee.repository";
import { TRANSACTION_REPOSITORY, TransactionRepository } from "../transaction-management/transaction/domain/repositories/transaction.repository";
import { EmployeeModule } from "../employee-management/employee/employee.module";
import { TransactionModule } from "../transaction-management/transaction/transaction.module";
import { FindAllCashRegisterByBranchOfficeIdUseCase } from "./cash-register/application/use-cases/find-all-cash-register-by-branch-office-id.use-case";
import { FindCashSessionByEmployeeIdUseCase } from "./cash-session/application/use-cases/find-cash-session-by-employee-id.use-case";
import { FindCashSessionWithTransactionsUseCase } from "./cash-session/application/use-cases/find-cash-session-with-transactions.use-case";
import { CloseCashSessionUseCase } from "./cash-session/application/use-cases/close-cash-session.use-case";
import { ConnectionDBModule } from "src/config/database/typeorm/connection/connection-db.module";
import { FindCashMovementsByBranchOfficeUseCase } from "./cash-session/application/use-cases/find-cash-movements-by-branch-office-id.use-case";
import { FindCashSessionAllByBranchOfficeUseCase } from "./cash-session/application/use-cases/find-cash-session-all-by-branch-office-id.use-case";

@Module({
    imports: [
        TypeOrmModule.forFeature([CashRegisterOrmEntity, CashSessionOrmEntity]),
        BranchOfficeModule,
        EmployeeModule,
        forwardRef(()=> TransactionModule),
        ConnectionDBModule,
    ],
    providers: [
        {
            provide: CASH_REGISTER_REPOSITORY,
            useClass: TypeormCashRegisterRepository
        },
        {
            provide: CASH_SESSION_REPOSITORY,
            useClass: TypeormCashSessionRepository
        },
        {
            provide: RegisterCashRegisterUseCase,
            useFactory: (cashRegisterRepo: CashRegisterRepository, branchOfficeRepo: BranchOfficeRepository)=> {
                return new RegisterCashRegisterUseCase(cashRegisterRepo, branchOfficeRepo);
            },
            inject:[CASH_REGISTER_REPOSITORY, BRANCH_OFFICE_REPOSITORY]
        },
        {
            provide: OpenCashSessionUseCase,
            useFactory: (
                cashSesssionRepo: CashSessionRepository,
                cashRegisterRepo: CashRegisterRepository,
                employeeRepo: EmployeeRepository,
                transactionRepo: TransactionRepository
            )=> {
                return new OpenCashSessionUseCase(cashSesssionRepo, cashRegisterRepo, employeeRepo, transactionRepo);
            },
            inject:[CASH_SESSION_REPOSITORY, CASH_REGISTER_REPOSITORY, EMPLOYEE_REPOSITORY, TRANSACTION_REPOSITORY]
        },
        {
            provide: FindAllCashRegisterByBranchOfficeIdUseCase,
            useFactory: (repo: CashRegisterRepository)=> {
                return new FindAllCashRegisterByBranchOfficeIdUseCase(repo);
            },
            inject:[
                CASH_REGISTER_REPOSITORY
            ]
        },
        {
            provide: FindCashSessionByEmployeeIdUseCase,
            useFactory: (repo: CashSessionRepository)=> {
                return new FindCashSessionByEmployeeIdUseCase(repo)
            },
            inject:[
                CASH_SESSION_REPOSITORY
            ]
        },
        {
            provide: FindCashSessionWithTransactionsUseCase,
            useFactory: (repo: CashSessionRepository)=> {
                return new FindCashSessionWithTransactionsUseCase(repo)
            },
            inject:[
                CASH_SESSION_REPOSITORY
            ]
        },
        {
            provide: FindCashMovementsByBranchOfficeUseCase,
            useFactory: (repo: CashSessionRepository)=> {
                return new FindCashMovementsByBranchOfficeUseCase(repo)
            },
            inject:[
                CASH_SESSION_REPOSITORY
            ]
        },
        {
            provide: FindCashSessionAllByBranchOfficeUseCase,
            useFactory: (repo: CashSessionRepository)=> {
                return new FindCashSessionAllByBranchOfficeUseCase(repo)
            },
            inject:[
                CASH_SESSION_REPOSITORY
            ]
        },
        {
            provide: CloseCashSessionUseCase,
            useFactory: (repo: CashSessionRepository, transactionRepo: TransactionRepository)=> {
                return new CloseCashSessionUseCase(repo, transactionRepo)
            },
            inject:[
                CASH_SESSION_REPOSITORY, TRANSACTION_REPOSITORY
            ]
        },
    ],
    controllers: [
        CashRegisterController
    ],
    exports:[
        CASH_SESSION_REPOSITORY,
        CASH_REGISTER_REPOSITORY,
    ]
})
export class CashModule{}