import 'reflect-metadata';
import { newDb } from 'pg-mem';
import { DataSource } from 'typeorm';
import { ImageOrmEntity } from '@/contexts/image-management/image/infraestructura/persistence/typeorm/entities/image.orm-entity';

/**
 * Crea un DataSource de TypeORM respaldado por pg-mem (Postgres en memoria),
 * únicamente con `ImageOrmEntity`. Se usa en los tests de use-cases de
 * `image-management` para ejercitar `TypeOrmImageRepository` real, sin
 * depender de una base de datos real ni de los otros bounded contexts.
 */
export async function createPgMemImageDataSource(): Promise<DataSource> {
  const db = newDb({ autoCreateForeignKeyIndices: true });

  // pg-mem no implementa estas funciones de Postgres por defecto; TypeORM las
  // invoca al inicializar la conexión.
  db.public.registerFunction({ name: 'current_database', implementation: () => 'test' });
  db.public.registerFunction({ name: 'version', implementation: () => 'PostgreSQL 14.0' });

  const dataSource: DataSource = db.adapters.createTypeormDataSource({
    type: 'postgres',
    entities: [ImageOrmEntity],
    synchronize: true,
  });

  await dataSource.initialize();
  return dataSource;
}
