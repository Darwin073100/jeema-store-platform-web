# Estrategia Unificada de TypeORM

## Problema Resuelto
Antes había **duplicación de configuración**: dos formas diferentes de crear el DataSource con configuraciones inconsistentes.

## Solución Implementada: Configuración Centralizada

### Arquitectura

```
config.ts (FUENTE ÚNICA DE VERDAD)
    ↓
    ├─→ typeorm-connection.ts (Singleton para la App)
    │   └─→ getDataSource() / getDataSourceOrFail()
    │
    └─→ app.data.source.ts (Scripts de Migración)
        └─→ AppDataSource (para CLI de TypeORM)
```

### Archivos

#### 1️⃣ `config.ts` - **Fuente Única de Verdad**
- Define `getDataSourceConfig()`: retorna toda la configuración de TypeORM
- Carga variables de entorno una sola vez
- **Responsabilidad**: Centralizar TODA la configuración

```typescript
export const getDataSourceConfig = (): DataSourceOptions => {
  // Pool settings, logging, entities, migraciones...
}
```

#### 2️⃣ `typeorm-connection.ts` - **Singleton para la App**
- Patrón singleton: una única conexión reutilizada
- Usa `getDataSourceConfig()` de config.ts
- **Cuándo usar**:
  ```typescript
  import { getDataSource } from '@config/typeorm-connection';
  
  const dataSource = await getDataSource();
  const userRepo = dataSource.getRepository(User);
  ```

#### 3️⃣ `app.data.source.ts` - **Compatible con Scripts de Migración**
- Crea un `AppDataSource` para CLI de TypeORM
- Reutiliza `getDataSourceConfig()` de config.ts
- **Cuándo se usa**: Automáticamente por scripts de migración
  ```bash
  npm run migrate:generate "MigrationName"
  npm run migrate:run
  npm run migrate:revert
  ```

### Ventajas de Esta Arquitectura

✅ **Sin duplicación**: Una configuración para toda la app  
✅ **Consistencia**: Pool settings, logging, entities... iguales en todos lados  
✅ **Mantenibilidad**: Cambiar config afecta a la app y migraciones  
✅ **Flexible**: Dos patrones según el caso de uso:
- **App**: Singleton thread-safe con `getDataSource()`
- **Migraciones**: DataSource exportado para CLI

### Migrar de la Vieja Forma

**Si estabas usando directamente `AppDataSource`:**
```typescript
// ❌ Viejo (evitar)
import { AppDataSource } from '@config/app.data.source';
const dataSource = AppDataSource;

// ✅ Nuevo (preferir)
import { getDataSource } from '@config/typeorm-connection';
const dataSource = await getDataSource();
```

### Casos de Uso

| Caso | Usar |
|------|-----|
| En la App (API, servicios) | `getDataSource()` de `typeorm-connection.ts` |
| En migraciones | Scripts automáticos (usan `app.data.source.ts`) |
| En tests | `getDataSource()` + `closeDataSource()` |
| Verificar inicialización | `isDataSourceInitialized()` |
