import { TemplateRepository } from "src/shared/domain/repositories/template.repository";
import { PermissionEntity } from "../entities/permission-entity";

export const PERMISSION_REPOSITORY = Symbol('PERMISSION_REPOSITORY');

// Heredamos del template para obtener las firmas comunes, finById, findAll, etc.
export interface PermissionRepository extends TemplateRepository<PermissionEntity>{

    findByName(name: string): Promise<PermissionEntity | null>;

}