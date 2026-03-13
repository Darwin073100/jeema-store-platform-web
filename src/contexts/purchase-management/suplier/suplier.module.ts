import { Module } from "@nestjs/common";
import { SuplierController } from "./presentation/controllers/suplier.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { SuplierOrmEntity } from "./infraestructure/persistence/typeorm/entities/suplier.orm-entity";
import { TypeOrmSuplierRepository } from "./infraestructure/persistence/typeorm/repositories/typeorm-suplier.repository";
import { RegisterSuplierUseCase } from "./application/use-cases/register-suplier.use-case";
import { SUPLIER_REPOSITORY, SuplierRepository } from "./domain/repositories/suplier.repository";
import { ESTABLISHMENT, EstablishmentRepository } from "src/contexts/establishment-management/establishment/domain/repositories/establishment.repository";
import { EstablishmentModule } from "src/contexts/establishment-management/establishment/establishment.module";
import { FindAllSuplierByEstablishmentUseCase } from "./application/use-cases/find-all-supliers-by-establishment.use-case";

@Module({
    imports: [
      TypeOrmModule.forFeature([SuplierOrmEntity]),
      EstablishmentModule,
    ],
    controllers: [
      // Los controladores que manejan las solicitudes HTTP para este módulo.
      SuplierController,
    ],
    providers: [
      {
        provide: SUPLIER_REPOSITORY, // El "token" o la "interfaz" que se pide
        useClass: TypeOrmSuplierRepository, // La clase concreta que se provee
      },
      {
        provide: FindAllSuplierByEstablishmentUseCase, // Provee el caso de uso
        useFactory: (repo1: SuplierRepository) => {
          // NestJS inyecta el repo aquí basado en el token
          return new FindAllSuplierByEstablishmentUseCase(repo1);
        },
        inject: [SUPLIER_REPOSITORY], // Declara la dependencia para el factory
      },
      {
        provide: RegisterSuplierUseCase, // Provee el caso de uso
        useFactory: (repo1: SuplierRepository, estabRepo: EstablishmentRepository) => {
          // NestJS inyecta el repo aquí basado en el token
          return new RegisterSuplierUseCase(repo1, estabRepo);
        },
        inject: [SUPLIER_REPOSITORY, ESTABLISHMENT], // Declara la dependencia para el factory
      }
    ],
    exports: [
      RegisterSuplierUseCase,
    ],
  })
  export class SuplierModule {}
  