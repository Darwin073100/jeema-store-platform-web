import { EstablishmentDetailEntity } from "../../domain/entities/establishment-detail.entity";
import { EstablishmentDetailResponseDto } from "../dtos/establishment-detail-response.dto";
import { IEstablishmentDetail } from "../../presentation/interfaces/IEstablishmentDetail";

/**
 * EstablishmentDetailMapper transforma la entidad de dominio
 * `EstablishmentDetailEntity` en los tipos aptos para la capa de
 * presentación (`EstablishmentDetailResponseDto` / `IEstablishmentDetail`).
 */
export class EstablishmentDetailMapper {
  public static toResponseDto(entity: EstablishmentDetailEntity): EstablishmentDetailResponseDto {
    return new EstablishmentDetailResponseDto(
      entity.establishmentDetailId.toString(),
      entity.establishmentId.toString(),
      entity.type,
      entity.value,
      entity.sortOrder,
      entity.createdAt,
      entity.updatedAt,
      entity.deletedAt,
    );
  }

  public static toIResponse(entity: EstablishmentDetailEntity): IEstablishmentDetail {
    return {
      establishmentDetailId: entity.establishmentDetailId,
      establishmentId: entity.establishmentId,
      type: entity.type,
      value: entity.value,
      sortOrder: entity.sortOrder,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      deletedAt: entity.deletedAt,
    };
  }
}
