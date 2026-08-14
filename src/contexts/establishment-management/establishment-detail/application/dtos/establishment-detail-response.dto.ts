import { EstablishmentDetailTypeEnum } from "src/contexts/establishment-management/establishment-detail/domain/enums/establishment-detail-type.enum";

/**
 * EstablishmentDetailResponseDto es el DTO de salida de los use-cases de
 * `establishment-detail` hacia la capa de presentación.
 */
export class EstablishmentDetailResponseDto {
  readonly establishmentDetailId: string;
  readonly establishmentId: string;
  readonly type: EstablishmentDetailTypeEnum;
  readonly value: string;
  readonly sortOrder: number;
  readonly createdAt: Date;
  readonly updatedAt: Date | null;
  readonly deletedAt: Date | null;

  constructor(
    establishmentDetailId: string,
    establishmentId: string,
    type: EstablishmentDetailTypeEnum,
    value: string,
    sortOrder: number,
    createdAt: Date,
    updatedAt: Date | null,
    deletedAt: Date | null,
  ) {
    this.establishmentDetailId = establishmentDetailId;
    this.establishmentId = establishmentId;
    this.type = type;
    this.value = value;
    this.sortOrder = sortOrder;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.deletedAt = deletedAt;
    Object.freeze(this);
  }
}
