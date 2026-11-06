---
name: new-migration
description: Flujo seguro para cambios de esquema en PostgreSQL con TypeORM en JEEMA - modificar la entidad ORM, registrarla, generar la migración, revisarla línea por línea y probarla. Úsalo siempre que haya que agregar, cambiar o quitar tablas, columnas, índices o relaciones.
argument-hint: <NombreDeLaMigracionEnPascalCase>
---

# Nueva migración

Nombre: `$ARGUMENTS` (PascalCase, describe el cambio: `AddFolioIndexToSale`).

1. **Estado limpio.** `pnpm migration:show` — si hay migraciones pendientes `[ ]`, detente y avisa:
   generar sobre una BD desactualizada produce migraciones con cambios ajenos.
2. **Entidad ORM.** Edita `*.orm-entity.ts` (ver reglas del agente `database`: `name:` snake_case
   explícito, `decimal(14,2)` para dinero, `bigint` para ids, índice en cada FK, `onDelete` deliberado).
   Si es nueva, regístrala en `entities` de `src/configuration/databases/typeorm/config/config.ts`.
   Actualiza también el mapper ORM ↔ dominio y la entidad de dominio si aplica.
3. **Generar.** `pnpm migration:generate $ARGUMENTS`.
4. **Revisar el archivo generado completo** (`src/configuration/databases/typeorm/migrations/`):
   - [ ] Solo contiene los cambios de esta tarea (quita drift ajeno y repórtalo).
   - [ ] Ningún `DROP COLUMN` + `ADD COLUMN` donde debería ir `RENAME COLUMN`.
   - [ ] `NOT NULL` nuevo sobre tabla con datos → default o backfill previo en el mismo `up()`.
   - [ ] `down()` revierte exactamente el `up()`, en orden inverso.
   - [ ] Nombres de índices/constraints legibles si los escribiste a mano.
5. **Probar.** Solo contra BD local y con confirmación del usuario:
   `pnpm migration:run` → `pnpm migration:revert` → `pnpm migration:run`. Si no hay BD disponible,
   dilo explícitamente en el reporte.
6. **Reporte.** Nombre del archivo, resumen del SQL del `up()`, impacto en datos existentes y si el
   despliegue necesita un paso extra (`sh/post-update.sh`).

Nunca edites una migración ya commiteada; si la anterior estaba mal, crea una correctiva.
