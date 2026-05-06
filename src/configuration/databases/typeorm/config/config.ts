import { DataSourceOptions } from 'typeorm';
import { entities } from './entities';
import { config } from 'dotenv';


/**
 * Configuración base de TypeORM
 * Se carga desde variables de entorno
 * 
 * Variables de entorno requeridas:
 * - DATABASE_URL: Conexión completa a PostgreSQL (ej: postgres://user:password@host:5432/dbname)
 * O alternativamente:
 * - DB_HOST, DB_PORT, DB_USERNAME, DB_PASSWORD, DB_NAME
 */
config();
export const getDataSourceConfig = (): DataSourceOptions => {
  const isProduction = process.env.NODE_ENV === 'production';
  const databaseUrl = process.env.DATABASE_URL;

  // Validar que existe la conexión
  if (!databaseUrl) {
    throw new Error(
      'Missing required environment variable: DATABASE_URL (ej: postgres://user:password@host:5432/dbname)'
    );
  }

  const config: DataSourceOptions = {
    type: 'postgres',
    url: databaseUrl,
    entities,
    synchronize: false,
    logging: process.env.DB_LOGGING === 'true',
    // ...(isProduction && {
    //   ssl: {
    //     rejectUnauthorized: false,
    //   },
    // }),
  };

  return config;
};
