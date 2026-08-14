import { EstablishmentDetailRepository } from "../../domain/repositories/establishment-detail.repository";
import { EstablishmentDetailEntity } from "../../domain/entities/establishment-detail.entity";
import { EstablishmentDetailNotFoundException } from "../../domain/exceptions/establishment-detail-not-found.exception";

/**
 * UpdateEstablishmentDetailUseCase actualiza el `value` de un
 * `EstablishmentDetail` existente. El `type` de un registro no se cambia de
 * negocio (ver `EstablishmentDetailFormModal` en el frontend, que
 * deshabilita el `<select>` de tipo en modo edición); se recibe aquí sólo
 * para reconstruir el VO con la misma regla de validación con la que fue
 * creado.
 */
export class UpdateEstablishmentDetailUseCase {
  constructor(private readonly establishmentDetailRepository: EstablishmentDetailRepository) {}

  public async execute(establishmentDetailId: bigint, newValue: string): Promise<EstablishmentDetailEntity> {
    const detail = await this.establishmentDetailRepository.findById(establishmentDetailId);
    if (!detail) {
      throw new EstablishmentDetailNotFoundException('No se encontró el dato de establecimiento a editar.');
    }

    detail.updateValue(detail.type, newValue);

    return this.establishmentDetailRepository.save(detail);
  }
}
