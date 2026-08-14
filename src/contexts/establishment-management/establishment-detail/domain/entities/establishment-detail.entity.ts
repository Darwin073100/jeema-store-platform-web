import { EstablishmentDetailTypeEnum } from "../enums/establishment-detail-type.enum";
import { EstablishmentDetailValueVO } from "../values-objects/establishment-detail-value.vo";

/**
 * EstablishmentDetailEntity representa una fila tipada de "dato extra" de un
 * `Establishment` (teléfono, WhatsApp, correo, sitio web, red social o
 * slogan comercial), pensada para imprimirse en el ticket de venta.
 *
 * Deliberadamente NO conoce la regla de colección "sólo una fila activa por
 * tipo singleton" (todo tipo distinto de `PHONE_NUMBER`/`WHATSAPP`) — esa
 * regla involucra otras filas del mismo dueño y vive en el use-case, mismo
 * criterio documentado en `ImageEntity` (src/contexts/image-management/image/
 * domain/entities/image.entity.ts) para "máximo 3 imágenes"/"una sola primaria".
 * Esta entidad sólo conoce y protege su propio estado individual.
 */
export class EstablishmentDetailEntity {
  private readonly _establishmentDetailId: bigint;
  private readonly _establishmentId: bigint;
  private readonly _type: EstablishmentDetailTypeEnum;
  private _value: EstablishmentDetailValueVO;
  private _sortOrder: number;
  private readonly _createdAt: Date;
  private _updatedAt: Date | null;
  private _deletedAt: Date | null;

  private constructor(
    establishmentDetailId: bigint,
    establishmentId: bigint,
    type: EstablishmentDetailTypeEnum,
    value: EstablishmentDetailValueVO,
    sortOrder: number,
    createdAt: Date,
    updatedAt: Date | null,
    deletedAt: Date | null,
  ) {
    this._establishmentDetailId = establishmentDetailId;
    this._establishmentId = establishmentId;
    this._type = type;
    this._value = value;
    this._sortOrder = sortOrder;
    this._createdAt = createdAt;
    this._updatedAt = updatedAt;
    this._deletedAt = deletedAt;
  }

  /**
   * Crea un nuevo `EstablishmentDetail`. El `value` se valida según `type`
   * a través de `EstablishmentDetailValueVO.create`.
   */
  static create(
    establishmentId: bigint,
    type: EstablishmentDetailTypeEnum,
    value: string,
    sortOrder: number,
  ): EstablishmentDetailEntity {
    return new EstablishmentDetailEntity(
      BigInt(0),
      establishmentId,
      type,
      EstablishmentDetailValueVO.create(type, value),
      sortOrder,
      new Date(),
      null,
      null,
    );
  }

  /**
   * Reconstituye una instancia desde la persistencia. No emite eventos ya
   * que representa un estado ya existente.
   */
  static reconstitute(
    establishmentDetailId: bigint,
    establishmentId: bigint,
    type: EstablishmentDetailTypeEnum,
    value: string,
    sortOrder: number,
    createdAt: Date,
    updatedAt: Date | null,
    deletedAt: Date | null,
  ): EstablishmentDetailEntity {
    return new EstablishmentDetailEntity(
      establishmentDetailId,
      establishmentId,
      type,
      EstablishmentDetailValueVO.create(type, value),
      sortOrder,
      createdAt,
      updatedAt,
      deletedAt,
    );
  }

  // Getters
  get establishmentDetailId(): bigint { return this._establishmentDetailId; }
  get establishmentId(): bigint { return this._establishmentId; }
  get type(): EstablishmentDetailTypeEnum { return this._type; }
  get value(): string { return this._value.value; }
  get sortOrder(): number { return this._sortOrder; }
  get createdAt(): Date { return this._createdAt; }
  get updatedAt(): Date | null { return this._updatedAt; }
  get deletedAt(): Date | null { return this._deletedAt; }

  /**
   * Actualiza el `value` del registro. Recibe `type` para reconstruir el VO
   * con la misma regla de validación con la que fue creado (el tipo de un
   * registro existente no cambia de negocio, ver `UpdateEstablishmentDetailUseCase`).
   */
  public updateValue(type: EstablishmentDetailTypeEnum, newRawValue: string): void {
    this._value = EstablishmentDetailValueVO.create(type, newRawValue);
    this._updatedAt = new Date();
  }

  public updateSortOrder(newSortOrder: number): void {
    if (this._sortOrder === newSortOrder) return;
    this._sortOrder = newSortOrder;
    this._updatedAt = new Date();
  }

  public softDelete(): void {
    if (this._deletedAt) return;
    this._deletedAt = new Date();
    this._updatedAt = new Date();
  }
}
