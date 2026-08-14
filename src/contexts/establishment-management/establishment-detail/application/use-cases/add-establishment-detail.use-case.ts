import { EstablishmentDetailRepository } from "../../domain/repositories/establishment-detail.repository";
import { EstablishmentDetailEntity } from "../../domain/entities/establishment-detail.entity";
import { EstablishmentDetailTypeEnum, isMultiValueEstablishmentDetailType } from "../../domain/enums/establishment-detail-type.enum";
import { DuplicateEstablishmentDetailTypeException } from "../../domain/exceptions/duplicate-establishment-detail-type.exception";

/**
 * AddEstablishmentDetailUseCase agrega un nuevo `EstablishmentDetail` a un
 * establecimiento. Para los tipos "singleton" (todos excepto
 * `PHONE_NUMBER`/`WHATSAPP`) valida, vía el repositorio, que no exista ya
 * una fila activa de ese mismo `type` — regla de colección que no vive en
 * la entidad porque involucra otras filas del mismo dueño (mismo criterio
 * que las reglas de colección de `ImageEntity`).
 */
export class AddEstablishmentDetailUseCase {
  constructor(private readonly establishmentDetailRepository: EstablishmentDetailRepository) {}

  public async execute(
    establishmentId: bigint,
    type: EstablishmentDetailTypeEnum,
    value: string,
    sortOrder: number = 0,
  ): Promise<EstablishmentDetailEntity> {
    if (!isMultiValueEstablishmentDetailType(type)) {
      const existing = await this.establishmentDetailRepository.findByEstablishmentIdAndType(establishmentId, type);
      if (existing.length > 0) {
        throw new DuplicateEstablishmentDetailTypeException(
          `Ya existe un dato de tipo '${type}' para este establecimiento. Edítalo en vez de agregar uno nuevo.`,
        );
      }
    }

    const detail = EstablishmentDetailEntity.create(establishmentId, type, value, sortOrder);
    return this.establishmentDetailRepository.save(detail);
  }
}
