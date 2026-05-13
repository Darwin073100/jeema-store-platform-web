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
    // migrations: [`${__dirname}/../migrations/*.{ts,js}`],
    // migrationsTableName: 'migrations',
    logging: process.env.DB_LOGGING === 'true',
    // ✅ POOL CONFIGURATION - Previene agotamiento de conexiones
    // En TypeORM v0.3.x, la configuración del pool se pasa a través de 'extra'
    // que se envía directamente al driver 'pg' de node-postgres
    extra: {
      // Máximo de conexiones simultáneas (por defecto pg usa 10, con esto aumentamos a 20)
      max: 20,
      // Conexiones mínimas siempre activas
      min: 2,
      // Cierra conexiones inactivas después de 30 segundos
      // Evita que conexiones muertas se acumulen
      idleTimeoutMillis: 30000,
      // Timeout al obtener conexión del pool (en lugar de esperar indefinidamente)
      // Si no hay conexión disponible en 2s, falla la query
      connectionTimeoutMillis: 2000,
      // Reutilizar conexión máximo 7500 veces antes de cerrar
      // Las conexiones degradadas se reciclan
      maxUses: 7500,
    },
    // ...(isProduction && {
    //   ssl: {
    //     rejectUnauthorized: false,
    //   },
    // }),
  };

  return config;
};
