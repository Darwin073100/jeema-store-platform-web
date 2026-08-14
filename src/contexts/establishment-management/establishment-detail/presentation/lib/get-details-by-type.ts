import { EstablishmentDetailTypeEnum } from "@/contexts/establishment-management/establishment-detail/domain/enums/establishment-detail-type.enum";
import { IEstablishmentDetail } from "@/contexts/establishment-management/establishment-detail/presentation/interfaces/IEstablishmentDetail";

/**
 * Filtra los `IEstablishmentDetail` de un `type` dado. Función pura,
 * utilizada tanto por la UI de gestión como por el ticket de venta para no
 * duplicar el criterio de filtrado.
 */
export function getDetailsByType(
  details: IEstablishmentDetail[] | undefined,
  type: EstablishmentDetailTypeEnum,
): IEstablishmentDetail[] {
  return (details ?? []).filter((detail) => detail.type === type);
}

/** Primer `IEstablishmentDetail` de un `type` singleton, o `null` si no existe. */
export function getFirstDetailByType(
  details: IEstablishmentDetail[] | undefined,
  type: EstablishmentDetailTypeEnum,
): IEstablishmentDetail | null {
  return getDetailsByType(details, type)[0] ?? null;
}
