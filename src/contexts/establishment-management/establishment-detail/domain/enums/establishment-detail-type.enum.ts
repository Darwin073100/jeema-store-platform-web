/**
 * Catálogo de tipos de "dato extra" que un `Establishment` puede registrar
 * (teléfono, redes sociales, sitio web, slogan comercial, ...).
 *
 * `PHONE_NUMBER` y `WHATSAPP` admiten múltiples filas activas por
 * establecimiento. El resto de los valores admiten como máximo una fila
 * activa por establecimiento (regla reforzada en el use-case y con un
 * índice único parcial en Postgres, ver la migración de esta feature).
 */
export enum EstablishmentDetailTypeEnum {
  PHONE_NUMBER = 'PHONE_NUMBER',
  WHATSAPP = 'WHATSAPP',
  EMAIL = 'EMAIL',
  WEBSITE = 'WEBSITE',
  FACEBOOK = 'FACEBOOK',
  INSTAGRAM = 'INSTAGRAM',
  TIKTOK = 'TIKTOK',
  SLOGAN = 'SLOGAN',
}

/** Tipos que admiten múltiples filas activas por establecimiento. */
export const MULTI_VALUE_ESTABLISHMENT_DETAIL_TYPES: readonly EstablishmentDetailTypeEnum[] = [
  EstablishmentDetailTypeEnum.PHONE_NUMBER,
  EstablishmentDetailTypeEnum.WHATSAPP,
];

/** `true` si el tipo admite varias filas activas por establecimiento (no es singleton). */
export function isMultiValueEstablishmentDetailType(type: EstablishmentDetailTypeEnum): boolean {
  return (MULTI_VALUE_ESTABLISHMENT_DETAIL_TYPES as EstablishmentDetailTypeEnum[]).includes(type);
}
