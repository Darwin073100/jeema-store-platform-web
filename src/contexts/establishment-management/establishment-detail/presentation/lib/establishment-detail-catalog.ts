import { EstablishmentDetailTypeEnum } from "@/contexts/establishment-management/establishment-detail/domain/enums/establishment-detail-type.enum";
import { SelectMenuOption } from "@/shared/ui/components/inputs/SelectMenu";

/**
 * Catálogo compartido de metadatos de presentación por
 * `EstablishmentDetailTypeEnum`: etiqueta en español, placeholder sugerido
 * para el formulario, y las opciones listas para `SelectMenu`.
 *
 * Centralizado acá para que el modal de alta/edición y la tarjeta de
 * "Datos de contacto" no dupliquen estos textos.
 */
export const ESTABLISHMENT_DETAIL_TYPE_LABELS: Record<EstablishmentDetailTypeEnum, string> = {
  [EstablishmentDetailTypeEnum.PHONE_NUMBER]: 'Teléfono',
  [EstablishmentDetailTypeEnum.WHATSAPP]: 'WhatsApp',
  [EstablishmentDetailTypeEnum.EMAIL]: 'Correo electrónico',
  [EstablishmentDetailTypeEnum.WEBSITE]: 'Sitio web',
  [EstablishmentDetailTypeEnum.FACEBOOK]: 'Facebook',
  [EstablishmentDetailTypeEnum.INSTAGRAM]: 'Instagram',
  [EstablishmentDetailTypeEnum.TIKTOK]: 'TikTok',
  [EstablishmentDetailTypeEnum.SLOGAN]: 'Slogan',
};

export const ESTABLISHMENT_DETAIL_TYPE_PLACEHOLDERS: Record<EstablishmentDetailTypeEnum, string> = {
  [EstablishmentDetailTypeEnum.PHONE_NUMBER]: 'Ej: 741-107-3337',
  [EstablishmentDetailTypeEnum.WHATSAPP]: 'Ej: 741-107-3337',
  [EstablishmentDetailTypeEnum.EMAIL]: 'Ej: contacto@miempresa.com',
  [EstablishmentDetailTypeEnum.WEBSITE]: 'Ej: https://miempresa.com',
  [EstablishmentDetailTypeEnum.FACEBOOK]: 'Ej: Papelería y Novedades "La Bonita"',
  [EstablishmentDetailTypeEnum.INSTAGRAM]: 'Ej: @mi_empresa',
  [EstablishmentDetailTypeEnum.TIKTOK]: 'Ej: @mi_empresa',
  [EstablishmentDetailTypeEnum.SLOGAN]: 'Ej: Mayoreo y menudeo',
};

export const ESTABLISHMENT_DETAIL_TYPE_OPTIONS: SelectMenuOption[] = Object.values(EstablishmentDetailTypeEnum).map(
  (type) => ({ value: type, text: ESTABLISHMENT_DETAIL_TYPE_LABELS[type] })
);

/** Orden fijo en el que se listan los tipos "singleton" en la UI de gestión. */
export const SINGLETON_ESTABLISHMENT_DETAIL_TYPES_ORDER: readonly EstablishmentDetailTypeEnum[] = [
  EstablishmentDetailTypeEnum.EMAIL,
  EstablishmentDetailTypeEnum.WEBSITE,
  EstablishmentDetailTypeEnum.FACEBOOK,
  EstablishmentDetailTypeEnum.INSTAGRAM,
  EstablishmentDetailTypeEnum.TIKTOK,
  EstablishmentDetailTypeEnum.SLOGAN,
];
