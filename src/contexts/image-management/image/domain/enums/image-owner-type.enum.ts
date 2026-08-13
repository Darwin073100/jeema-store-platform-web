/**
 * Tipos de dueño soportados por la entidad `Image` genérica.
 * Diseñado para poder agregar valores futuros (p. ej. `CATEGORY`, `BRAND`)
 * sin cambiar el resto del modelo.
 */
export enum ImageOwnerType {
  PRODUCT = 'PRODUCT',
  EMPLOYEE = 'EMPLOYEE',
  ESTABLISHMENT = 'ESTABLISHMENT',
}
