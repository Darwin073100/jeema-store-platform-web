import { Module } from "@nestjs/common";
import { BranchOfficeController } from "./presentation/controllers/branch-office.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { BranchOfficeOrmEntity } from "./infraestructure/persistence/typeorm/entities/branch-office.orm-entity";
import { BranchOfficeEntity } from "./domain/entities/branch-office.entity";
import { TypeOrmBranchOfficeRepository } from "./infraestructure/persistence/typeorm/repositories/typeorm-branch-office.repository";
import { RegisterBranchOfficeUseCase } from "./application/use-cases/register-branch-office.use-case";
import { BRANCH_OFFICE_REPOSITORY, BranchOfficeRepository } from "./domain/repositories/branch-office.repository";
import { EstablishmentModule } from "../establishment/establishment.module";
import { ESTABLISHMENT_CHECKER_PORT, EstablishmentCheckerPort } from "../establishment/application/ports/out/establishment-checker.port";
import { BRANCH_OFFICE_CHECKER_PORT } from "./domain/ports/out/branch-office-checker.port";
import { BranchOfficeCheckerAdapter } from "./infraestructure/persistence/typeorm/external-service/branch-office-checker.adapter";
import { UpdateBranchOfficeUseCase } from "./application/use-cases/update-branch-office.use-case";

/**
 * BranchOfficeModule es el módulo de NestJS que agrupa todos los componentes
 * relacionados con la gestión de centros educativos.
 *
 * Se encarga de la configuración de la inyección de dependencias para este contexto,
 * enlazando las interfaces de dominio con sus implementaciones de infraestructura.
 */
@Module({
    imports: [
      TypeOrmModule.forFeature([BranchOfficeOrmEntity]),
      EstablishmentModule,
    ],
    controllers: [
      BranchOfficeController,
    ],
    providers: [

      {
        provide: BRANCH_OFFICE_REPOSITORY,
        useClass: TypeOrmBranchOfficeRepository,
      },
      {
        provide: BRANCH_OFFICE_CHECKER_PORT,
        useClass: BranchOfficeCheckerAdapter,
      },
      {
        provide: RegisterBranchOfficeUseCase,
        useFactory: (repo1: BranchOfficeRepository,repo2: EstablishmentCheckerPort) => {
          return new RegisterBranchOfficeUseCase(repo1, repo2);
        },
        inject: [BRANCH_OFFICE_REPOSITORY, ESTABLISHMENT_CHECKER_PORT],
      },
      {
        provide: UpdateBranchOfficeUseCase,
        useFactory: (repo1: BranchOfficeRepository) => {
          return new UpdateBranchOfficeUseCase(repo1);
        },
        inject: [BRANCH_OFFICE_REPOSITORY],
      }
    ],
    exports: [
      RegisterBranchOfficeUseCase,
      BRANCH_OFFICE_CHECKER_PORT,
      BRANCH_OFFICE_REPOSITORY,
    ],
  })
  export class BranchOfficeModule {}
  