import { TemplateRepository } from "src/shared/domain/repositories/template.repository";
import { SuplierEntity } from "../entities/suplier.entity";

export const SUPLIER_REPOSITORY = Symbol('SUPLIER_REPOSITORY');
/**
 * BranchOfficeRepository es una interfaz (Puerto de Salida) que define
 * el contrato para la persistencia de los objetos BranchOffice.
 *
 * Esta interfaz es parte de la capa de Dominio, lo que significa que el Dominio
 * define lo que necesita para interactuar con la persistencia, no cómo se implementa.
 * Esto asegura la Inversión de Dependencias y la Independencia del Framework.
 */
export interface SuplierRepository extends TemplateRepository<SuplierEntity> {
  findByEmail(email: string, establishmentId: bigint):Promise<SuplierEntity| null>;
  findByRfc(rfc: string, establishmentId: bigint):Promise<SuplierEntity| null>;
  findAllByEstablishmentId(establishmentId: bigint, isAddress: boolean): Promise<SuplierEntity[]>;
  existById(id: bigint): Promise<SuplierEntity | null>;
}
  
