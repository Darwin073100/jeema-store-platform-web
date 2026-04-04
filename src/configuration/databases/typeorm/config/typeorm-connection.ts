import { DataSource } from 'typeorm';
import { getDataSourceConfig } from './config';
// import { entityRegistry } from './entities';
// import { registerAllEntities } from './register-entities';

// Registrar todas las entidades al importar este módulo
// registerAllEntities();

/**
 * Variable singleton para la conexión de TypeORM
 * Se reutiliza en toda la aplicación
 */
let dataSourceInstance: DataSource | null = null;

/**
 * Flag para controlar si se está inicializando la conexión
 */
let isInitializing = false;

/**
 * Obtiene o crea la instancia del DataSource
 * Garantiza una única conexión a la base de datos
 */
export async function getDataSource(): Promise<DataSource> {
  // Si ya existe la instancia y está inicializada, retornarla
  if (dataSourceInstance && dataSourceInstance.isInitialized) {
    return dataSourceInstance;
  }

  // Prevenir inicializaciones concurrentes
  if (isInitializing) {
    // Esperar un poco y reintentar
    await new Promise((resolve) => setTimeout(resolve, 100));
    return getDataSource();
  }

  isInitializing = true;

  try {
    if (!dataSourceInstance) {
      const config = getDataSourceConfig();
      // const entities = entityRegistry.getAll();

      if (config?.entities?.length === 0) {
        throw new Error(
          'No entities registered. Please register your entities before calling getDataSource()'
        );
      }

      dataSourceInstance = new DataSource({
        ...config,
        entities: config.entities,
      });
    }

    if (!dataSourceInstance.isInitialized) {
      await dataSourceInstance.initialize();
      console.log('DataSource initialized successfully');
    }

    return dataSourceInstance;
  } catch (error) {
    console.error('Error initializing DataSource:', error);
    dataSourceInstance = null;
    throw error;
  } finally {
    isInitializing = false;
  }
}

/**
 * Obtiene el DataSource ya inicializado
 * Lanza un error si no ha sido inicializado
 */
export function getDataSourceOrFail(): DataSource {
  if (!dataSourceInstance || !dataSourceInstance.isInitialized) {
    throw new Error(
      'DataSource is not initialized. Call getDataSource() first.'
    );
  }
  return dataSourceInstance;
}

/**
 * Cierra la conexión con la base de datos
 * Útil para testing y shutdown
 */
export async function closeDataSource(): Promise<void> {
  if (dataSourceInstance && dataSourceInstance.isInitialized) {
    await dataSourceInstance.destroy();
    dataSourceInstance = null;
  }
}

/**
 * Verifica si el DataSource está inicializado
 */
export function isDataSourceInitialized(): boolean {
  return dataSourceInstance !== null && dataSourceInstance.isInitialized;
}
