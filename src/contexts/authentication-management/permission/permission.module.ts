import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PermissionOrmEntity } from './infraestructure/persistence/typeorm/entities/permission.orm-entity';
import { PermissionController } from './presentation/controllers/permission.controller';
import { RegisterPermissionUseCase } from './application/use-cases/register-permission.use-case';
import { PERMISSION_REPOSITORY, PermissionRepository } from './domain/repositories/permission.repository';
import { TypeormPermissionRepository } from './infraestructure/persistence/typeorm/repositories/typeorm-permission.repository';
import { PERMISSION_CHECKER_PORT } from './domain/ports/out/permission-checker.port';
import { TypeormPermissionCheckerAdapter } from './infraestructure/persistence/typeorm/external-services/typeorm-permission-checker.adapter';

@Module({
  imports: [TypeOrmModule.forFeature([PermissionOrmEntity])],
  controllers: [PermissionController],
  providers: [
    {
        provide: PERMISSION_REPOSITORY,
        useClass: TypeormPermissionRepository
    },
    {
      provide: PERMISSION_CHECKER_PORT,
      useClass: TypeormPermissionCheckerAdapter
    },
    {
      provide: RegisterPermissionUseCase, // Provee el caso de uso
      useFactory: (repo: PermissionRepository) => {
        // NestJS inyecta el repo aquí basado en el token
        return new RegisterPermissionUseCase(repo);
      },
      inject: [PERMISSION_REPOSITORY], // Declara la dependencia para el factory
    },
  ],
  exports:[
    PERMISSION_CHECKER_PORT
  ]
})
export class PermissionModule {}
