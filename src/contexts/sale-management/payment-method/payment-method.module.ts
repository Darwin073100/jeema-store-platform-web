import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentMethodOrmEntity } from './infraestructure/persistence/typeorm/entities/payment-method.orm-entity';
import { PaymentMethodController } from './presentation/controllers/payment-method.controller';
import { RegisterPaymentMethodUseCase } from './application/use-cases/register-payment-method.use-case';
import { PAYMENT_METHOD, PaymentMethodRepository } from './domain/repositories/payment-method.repository';
import { TypeormPaymentMethodRepository } from './infraestructure/persistence/typeorm/repositories/typeorm-payment-method.repository';
import { TypeormPaymentMethodCheckerAdapter } from './infraestructure/persistence/typeorm/external-services/typeorm-payment-method-checker.adapter';
import { ViewAllPaymentMethodUseCase } from './application/use-cases/view-all-payment-method.use-case';
import { UpdatedPaymentMethodUseCase } from './application/use-cases/updated-payment-method.use-case';
import { DeletePaymentMethodUseCase } from './application/use-cases/delete-payment-method.use-case';
import { PAYMENT_METHOD_CHECKER_PORT } from './domain/ports/out/payment-method-checker.port';

@Module({
  imports: [TypeOrmModule.forFeature([PaymentMethodOrmEntity])],
  controllers: [PaymentMethodController],
  providers: [
    {
        provide: PAYMENT_METHOD,
        useClass: TypeormPaymentMethodRepository
    },
    {
      provide: PAYMENT_METHOD_CHECKER_PORT,
      useClass: TypeormPaymentMethodCheckerAdapter
    },
    {
      provide: RegisterPaymentMethodUseCase, // Provee el caso de uso
      useFactory: (repo: PaymentMethodRepository) => {
        // NestJS inyecta el repo aquí basado en el token
        return new RegisterPaymentMethodUseCase(repo);
      },
      inject: [
        PAYMENT_METHOD
      ], // Declara la dependencia para el factory
    },
    {
      provide: ViewAllPaymentMethodUseCase,
      useFactory: (repository: PaymentMethodRepository)=>{
        return new ViewAllPaymentMethodUseCase(repository);
      },
      inject: [PAYMENT_METHOD]
    },
    {
      provide: UpdatedPaymentMethodUseCase,
      useFactory: (repository: PaymentMethodRepository) => {
        return new UpdatedPaymentMethodUseCase(repository);
      },
      inject: [PAYMENT_METHOD]
    },
    {
      provide: DeletePaymentMethodUseCase,
      useFactory: (repository: PaymentMethodRepository) => {
        return new DeletePaymentMethodUseCase(repository);
      },
      inject: [PAYMENT_METHOD]
    }
  ],
  exports: [
    PAYMENT_METHOD_CHECKER_PORT
  ]
})
export class PaymentMethodModule {}
