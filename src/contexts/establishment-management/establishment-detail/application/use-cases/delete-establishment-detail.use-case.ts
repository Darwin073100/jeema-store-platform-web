import { EstablishmentDetailRepository } from "../../domain/repositories/establishment-detail.repository";
import { EstablishmentDetailNotFoundException } from "../../domain/exceptions/establishment-detail-not-found.exception";

/**
 * DeleteEstablishmentDetailUseCase realiza el borrado lógico (`deletedAt`)
 * de un `EstablishmentDetail`, consistente con el resto del proyecto.
 */
export class DeleteEstablishmentDetailUseCase {
  constructor(private readonly establishmentDetailRepository: EstablishmentDetailRepository) {}

  public async execute(establishmentDetailId: bigint): Promise<void> {
    const detail = await this.establishmentDetailRepository.findById(establishmentDetailId);
    if (!detail) {
      throw new EstablishmentDetailNotFoundException('No se encontró el dato de establecimiento a eliminar.');
    }

    await this.establishmentDetailRepository.delete(establishmentDetailId);
  }
}
