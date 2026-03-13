import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmployeeOrmEntity } from './infraestruture/persistence/typeorm/entities/employee-orm-entity';
import {
  EMPLOYEE_REPOSITORY,
  EmployeeRepository,
} from './domain/repositories/employee.repository';
import { TypeOrmEmployeeRepository } from './infraestruture/persistence/typeorm/repositories/typeorm-employee.repository';
import { RegisterEmployeeRoleUseCase } from './application/use-cases/register-employee.use-case';
import { FindEmployeeByIdUseCase } from './application/use-cases/find-employee-by-id.use-case';
import { EmployeeController } from './presentation/http/controllers/employee.controller';
import { BranchOfficeModule } from 'src/contexts/establishment-management/branch-office/branch-office.module';
import { EmployeeRoleModule } from '../employee-role/employee-role.module';
import { BRANCH_OFFICE_CHECKER_PORT, BranchOfficeCheckerPort } from 'src/contexts/establishment-management/branch-office/domain/ports/out/branch-office-checker.port';
import { EMPLOYEE_ROLE_CHECKER_PORT, EmployeeRoleChekerPort } from '../employee-role/domain/ports/out/employee-role-checker.port';
import { FindAllEmployeeByEstablishmentIdUseCase } from './application/use-cases/find-all-employee-by-establishment-id.use-case';
import { ConnectionDBModule } from 'src/config/database/typeorm/connection/connection-db.module';
import { RoleModule } from 'src/contexts/authentication-management/role/role.module';
import { CONNECTION_DB_REPOSITORIO, ConnectionDBRepository } from 'src/config/database/typeorm/connection/domain/repositories/connection-repository';
import { EmployeeSharedModule } from './employee-shared.module';
import { UpdateEmployeeUseCase } from './application/use-cases/update-employee.use-case';

/**
 * EstablishmentModule es el módulo de NestJS que agrupa todos los componentes
 * relacionados con la gestión de centros educativos.
 *
 * Se encarga de la configuración de la inyección de dependencias para este contexto,
 * enlazando las interfaces de dominio con sus implementaciones de infraestructura.
 */
@Module({
  imports: [
    // Importa las entidades de TypeORM que este módulo utilizará.
    // Esto es crucial para que TypeORM sepa qué tablas debe gestionar.
    ConnectionDBModule,
    TypeOrmModule.forFeature([EmployeeOrmEntity]),
    BranchOfficeModule,
    EmployeeRoleModule,
    EmployeeSharedModule,
    RoleModule,
  ],
  controllers: [
    // Los controladores que manejan las solicitudes HTTP para este módulo.
    EmployeeController,
  ],
  providers: [
    // Define los proveedores de servicios y cómo se inyectan las dependencias.

    // --- Implementación del Repositorio de Infraestructura ---
    // Proporciona la implementación concreta de EstablishmentRepository.
    // Aquí es donde enlazamos la interfaz de dominio (EstablishmentRepository)
    // con su implementación de infraestructura (TypeOrmEstablishmentRepository).
    {
      provide: EMPLOYEE_REPOSITORY, // El "token" o la "interfaz" que se pide
      useClass: TypeOrmEmployeeRepository, // La clase concreta que se provee
    },
    {
      provide: RegisterEmployeeRoleUseCase, // Provee el caso de uso
      useFactory: (
        repo: EmployeeRepository, checkerEmployeeRole: EmployeeRoleChekerPort, 
        checkerBranch: BranchOfficeCheckerPort, connectionDBRepository: ConnectionDBRepository
      ) => {
        // NestJS inyecta el repo aquí basado en el token
        return new RegisterEmployeeRoleUseCase(
          repo, checkerEmployeeRole, checkerBranch, 
          connectionDBRepository
        );
      },
      inject: [
        EMPLOYEE_REPOSITORY, EMPLOYEE_ROLE_CHECKER_PORT, BRANCH_OFFICE_CHECKER_PORT, CONNECTION_DB_REPOSITORIO
      ], // Declara la dependencia para el factory
    },
    {
      provide: UpdateEmployeeUseCase, // Provee el caso de uso
      useFactory: (
        repo: EmployeeRepository, checkerEmployeeRole: EmployeeRoleChekerPort, 
        checkerBranch: BranchOfficeCheckerPort
      ) => {
        // NestJS inyecta el repo aquí basado en el token
        return new UpdateEmployeeUseCase(
          repo, checkerEmployeeRole, checkerBranch
        );
      },
      inject: [
        EMPLOYEE_REPOSITORY, EMPLOYEE_ROLE_CHECKER_PORT, BRANCH_OFFICE_CHECKER_PORT
      ], // Declara la dependencia para el factory
    },
    {
      provide: FindEmployeeByIdUseCase, // Provee el caso de uso
      useFactory: (repo: EmployeeRepository) => {
        // NestJS inyecta el repo aquí basado en el token
        return new FindEmployeeByIdUseCase(repo);
      },
      inject: [EMPLOYEE_REPOSITORY], // Declara la dependencia para el factory
    },
    {
      provide: FindAllEmployeeByEstablishmentIdUseCase, // Provee el caso de uso
      useFactory: (repo: EmployeeRepository) => {
        // NestJS inyecta el repo aquí basado en el token
        return new FindAllEmployeeByEstablishmentIdUseCase(repo);
      },
      inject: [EMPLOYEE_REPOSITORY], // Declara la dependencia para el factory
    },
  ],
  exports: [
    // Exporta los proveedores y módulos que otras partes de la aplicación (otros módulos)
    // podrían necesitar. Por ejemplo, si otro módulo necesita usar RegisterEstablishmentUseCase.
    RegisterEmployeeRoleUseCase,
    FindEmployeeByIdUseCase,
    EMPLOYEE_REPOSITORY, // Exporta el repositorio para que otros módulos puedan usarlo
  ],
})
export class EmployeeModule {}