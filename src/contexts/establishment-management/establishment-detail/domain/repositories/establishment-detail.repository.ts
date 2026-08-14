import { EstablishmentDetailEntity } from "../entities/establishment-detail.entity";
import { EstablishmentDetailTypeEnum } from "../enums/establishment-detail-type.enum";

export const ESTABLISHMENT_DETAIL_REPOSITORY = Symbol('ESTABLISHMENT_DETAIL_REPOSITORY');

/**
 * EstablishmentDetailRepository es el puerto de salida (interfaz de dominio)
 * para la persistencia de `EstablishmentDetailEntity`.
 */
export interface EstablishmentDetailRepository {
  save(detail: EstablishmentDetailEntity): Promise<EstablishmentDetailEntity>;

  findById(establishmentDetailId: bigint): Promise<EstablishmentDetailEntity | null>;

  /** Filas activas (no borradas) de un establecimiento. */
  findAllByEstablishmentId(establishmentId: bigint): Promise<EstablishmentDetailEntity[]>;

  /**
   * Filas activas de un establecimiento para un `type` específico. Usado por
   * `AddEstablishmentDetailUseCase` para chequear duplicados de tipos
   * singleton antes de insertar.
   */
  findByEstablishmentIdAndType(
    establishmentId: bigint,
    type: EstablishmentDetailTypeEnum,
  ): Promise<EstablishmentDetailEntity[]>;

  /** Soft delete (`deletedAt`), consistente con el resto del esquema. */
  delete(establishmentDetailId: bigint): Promise<void>;
}
