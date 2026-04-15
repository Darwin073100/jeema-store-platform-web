import { EstablishmentEntity } from "../entities/establishment.entity";

export const ESTABLISHMENT = Symbol('ESTABLISHMENT');

export interface EstablishmentRepository {
  /**
   * Guarda o actualiza un centro educativo en la persistencia.
   *
   * @param center La instancia de EducationalCenter a guardar.
   * @returns Una Promesa que se resuelve cuando la operación ha terminado.
   */
  save(center: EstablishmentEntity): Promise<EstablishmentEntity>;

  /**
   * Busca un centro educativo por su ID.
   *
   * @param id El ID del centro educativo.
   * @returns Una Promesa que se resuelve con la instancia de EducationalCenter
   * si se encuentra, o `null` si no existe.
   */
  findById(id: bigint): Promise<EstablishmentEntity | null>;

  transactionUpdate(establishment: EstablishmentEntity): Promise<EstablishmentEntity>;

  existById(establishmentId: bigint): Promise<EstablishmentEntity | null>;
}