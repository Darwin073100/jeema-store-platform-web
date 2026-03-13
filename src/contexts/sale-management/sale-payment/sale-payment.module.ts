import { Module, forwardRef } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { SalePaymentOrmEntity } from "./infraestructure/entities/sale-payment.orm-entity";
import { SALE_PAYMENT_REPOSITORY } from "./domain/repositories/sale-payment.repository";
import { TypeormSalePaymentRepository } from "./infraestructure/repositories/typeorm-sale-payment.repository";
import { RegisterSalePaymentUseCase } from "./application/use-cases/register-sale-payment.use-case";
import { SALE_REPOSITORY } from "../sale/domain/repositories/sale.repository";
import { PAYMENT_METHOD_CHECKER_PORT } from "../payment-method/domain/ports/out/payment-method-checker.port";
import { PaymentMethodModule } from "../payment-method/payment-method.module";
import { SaleModule } from "../sale/sale.module";
import { TransactionModule } from "src/contexts/transaction-management/transaction/transaction.module";
import { TRANSACTION_REPOSITORY, TransactionRepository } from "src/contexts/transaction-management/transaction/domain/repositories/transaction.repository";
import { CONNECTION_DB_REPOSITORIO, ConnectionDBRepository } from "src/config/database/typeorm/connection/domain/repositories/connection-repository";
import { ConnectionDBModule } from "src/config/database/typeorm/connection/connection-db.module";

@Module({
    imports: [
        TypeOrmModule.forFeature([SalePaymentOrmEntity]),
        PaymentMethodModule,
        forwardRef(()=> TransactionModule),
        forwardRef(() => SaleModule),
        ConnectionDBModule,
    ],
    providers: [
        {
            provide: SALE_PAYMENT_REPOSITORY,
            useClass: TypeormSalePaymentRepository
        },
        {
            provide: RegisterSalePaymentUseCase,
            useFactory: (salePaymentRepository, saleRepository, paymentMethodCheckerPort, transactionRepository:TransactionRepository, connection: ConnectionDBRepository) => {
                return new RegisterSalePaymentUseCase(
                    salePaymentRepository,
                    saleRepository,
                    paymentMethodCheckerPort,
                    transactionRepository,
                    connection,
                );
            },
            inject: [
                SALE_PAYMENT_REPOSITORY,
                SALE_REPOSITORY,
                PAYMENT_METHOD_CHECKER_PORT,
                TRANSACTION_REPOSITORY,
                CONNECTION_DB_REPOSITORIO,
            ]
        }
    ],
    exports: [
        SALE_PAYMENT_REPOSITORY,
        RegisterSalePaymentUseCase
    ]
})
export class SalePaymentModule{}