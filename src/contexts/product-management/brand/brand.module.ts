import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BrandOrmEntity } from './infraestruture/persistence/typeorm/entities/brand-orm-entity';
import {
  BRAND_REPOSITORY,
  BrandRepository,
} from './domain/repositories/brand.repository';
import { TypeOrmBrandRepository } from './infraestruture/persistence/typeorm/repositories/typeorm-brand.repository';
import { RegisterBrandUseCase } from './application/use-cases/register-brand.use-case';
import { FindBrandByIdUseCase } from './application/use-cases/find-brand-by-id.use-case';
import { BrandController } from './presentation/http/controllers/brand.controller';
import { BRAND_CHECKER_PORT } from './domain/ports/out/brand-checker.port';
import { TypeormBrandCheckerAdapter } from './infraestruture/persistence/typeorm/external-services/typeorm-brand-checker.adapter';
import { ViewAllBrandsUseCase } from './application/use-cases/view-all-brands.use-case';
import { DeleteBrandUseCase } from './application/use-cases/delete-brand.use-case';
import { UpdateBrandUseCase } from './application/use-cases/update-brand.use-case';
import { FindAllBrandByEstablishmentUseCase } from './application/use-cases/find-all-brand-by-establishment.use-case';

/**
 * BrandModule es el módulo de NestJS que agrupa todos los componentes
 * relacionados con la gestión de marcas de productos.
 *
 * Se encarga de la configuración de la inyección de dependencias para este contexto,
 * enlazando las interfaces de dominio con sus implementaciones de infraestructura.
 */
@Module({
  imports: [
    TypeOrmModule.forFeature([BrandOrmEntity]),
  ],
  controllers: [
    BrandController,
  ],
  providers: [
    {
      provide: BRAND_REPOSITORY, // El "token" o la "interfaz" que se pide
      useClass: TypeOrmBrandRepository, // La clase concreta que se provee
    },
    {
      provide: BRAND_CHECKER_PORT, // Provee el puerto de verificación de marcas
      useClass: TypeormBrandCheckerAdapter
    },
    {
      provide: RegisterBrandUseCase, useFactory: (repo: BrandRepository) => { return new RegisterBrandUseCase(repo); },
      inject: [BRAND_REPOSITORY], // Declara la dependencia para el factory
    },
    {
      provide: FindBrandByIdUseCase, useFactory: (repo: BrandRepository) => { return new FindBrandByIdUseCase(repo); },
      inject: [BRAND_REPOSITORY], // Declara la dependencia para el factory
    },
    {
      provide: ViewAllBrandsUseCase, useFactory: (repository: BrandRepository)=> { return new ViewAllBrandsUseCase(repository); },
      inject: [BRAND_REPOSITORY] 
    },
    {
      provide: FindAllBrandByEstablishmentUseCase, useFactory: (repository: BrandRepository)=> { return new FindAllBrandByEstablishmentUseCase(repository); },
      inject: [BRAND_REPOSITORY] 
    },
    {
      provide: DeleteBrandUseCase, useFactory: (repo: BrandRepository) => { return new DeleteBrandUseCase(repo); },
      inject: [BRAND_REPOSITORY],
    },
    {
      provide: UpdateBrandUseCase, useFactory: (repo: BrandRepository) => { return new UpdateBrandUseCase(repo); },
      inject: [BRAND_REPOSITORY],
    }

    // --- Casos de Uso (Servicios de Aplicación) ---
    // NestJS es lo suficientemente inteligente para inyectar automáticamente
    // la implementación correcta del repositorio (TypeOrmEstablishmentRepository)
    // en los constructores de estos casos de uso, porque ya la hemos provisto arriba.
    // RegisterEstablishmentUseCase,
    // FindEstablishmentByIdUseCase,

    // Mappers y DTOs no necesitan ser proveedores si son clases estáticas o DTOs puros.
    // EstablishmentMapper // Si tuviera métodos no estáticos o dependencias inyectables.
  ],
  exports: [
    // Exporta los proveedores y módulos que otras partes de la aplicación (otros módulos)
    // podrían necesitar. Por ejemplo, si otro módulo necesita usar RegisterEstablishmentUseCase.
    RegisterBrandUseCase,
    FindBrandByIdUseCase,
    BRAND_REPOSITORY, // Exporta el repositorio para que otros módulos puedan usarlo
    BRAND_CHECKER_PORT,
  ],
})
export class BrandModule {}
