import { Module } from "@nestjs/common";
import { CustomerController } from "./presentation/controllers/customer.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CustomerOrmEntity } from "./infraestructure/persistence/typeorm/entities/customer.orm-entity";
import { TypeOrmCustomerRepository } from "./infraestructure/persistence/typeorm/repositories/typeorm-customer.repository";
import { RegisterCustomerUseCase } from "./application/use-cases/register-customer.use-case";
import { CUSTOMER_REPOSITORY, CustomerRepository } from "./domain/repositories/customer.repository";
import { CUSTOMER_CHECKER_PORT } from "./domain/ports/out/customer-checker-port";
import { CustomerCheckerAdapter } from "./infraestructure/persistence/typeorm/external-services/customer-checker.adapter";
import { FindAllCustomerByEstablishmentUseCase } from "./application/use-cases/find-all-customer-by-establishment.use-case";
import { FindOneCustomerByEstablishmentUseCase } from "./application/use-cases/find-one-customer-by-establishment.use-case";

@Module({
    imports: [
      // Importa las entidades de TypeORM que este módulo utilizará.
      // Esto es crucial para que TypeORM sepa qué tablas debe gestionar.
      TypeOrmModule.forFeature([CustomerOrmEntity]),
    ],
    controllers: [
      // Los controladores que manejan las solicitudes HTTP para este módulo.
      CustomerController,
    ],
    providers: [
      {
        provide: CUSTOMER_REPOSITORY, // El "token" o la "interfaz" que se pide
        useClass: TypeOrmCustomerRepository, // La clase concreta que se provee
      },
      {
        provide: CUSTOMER_CHECKER_PORT,
        useClass: CustomerCheckerAdapter,
      },
      {
        provide: RegisterCustomerUseCase, // Provee el caso de uso
        useFactory: (repo1: CustomerRepository) => {
          // NestJS inyecta el repo aquí basado en el token
          return new RegisterCustomerUseCase(repo1);
        },
        inject: [CUSTOMER_REPOSITORY], // Declara la dependencia para el factory
      },
      {
        provide: FindAllCustomerByEstablishmentUseCase, // Provee el caso de uso
        useFactory: (repo1: CustomerRepository) => {
          // NestJS inyecta el repo aquí basado en el token
          return new FindAllCustomerByEstablishmentUseCase(repo1);
        },
        inject: [CUSTOMER_REPOSITORY], // Declara la dependencia para el factory
      },
      {
        provide: FindOneCustomerByEstablishmentUseCase, // Provee el caso de uso
        useFactory: (repo1: CustomerRepository) => {
          // NestJS inyecta el repo aquí basado en el token
          return new FindOneCustomerByEstablishmentUseCase(repo1);
        },
        inject: [CUSTOMER_REPOSITORY], // Declara la dependencia para el factory
      },
    ],
    exports: [
      RegisterCustomerUseCase,
      CUSTOMER_CHECKER_PORT
    ],
  })
  export class CustomerModule {}
  