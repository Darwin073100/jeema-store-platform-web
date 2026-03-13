import { BranchOfficeEntity } from "../entities/branch-office.entity";

/**
 * BranchOfficeRepository es una interfaz (Puerto de Salida) que define
 * el contrato para la persistencia de los objetos BranchOffice.
 *
 * Esta interfaz es parte de la capa de Dominio, lo que significa que el Dominio
 * define lo que necesita para interactuar con la persistencia, no cómo se implementa.
 * Esto asegura la Inversión de Dependencias y la Independencia del Framework.
 */
export interface BranchOfficeRepository {
    save(branchOffice: BranchOfficeEntity): Promise<BranchOfficeEntity>;
    findById(id: bigint): Promise<BranchOfficeEntity | null>;
    existById(branchOfficeId: bigint):Promise<BranchOfficeEntity | null>;
    update(branchOffice: BranchOfficeEntity): Promise<BranchOfficeEntity>;
  }
  
  // Define el token de inyección para esta interfaz.
  export const BRANCH_OFFICE_REPOSITORY = Symbol('BRANCH_OFFICE_REPOSITORY');