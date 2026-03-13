import { TemplateRepository } from "src/shared/domain/repositories/template.repository";
import { RolePermissionEntity } from "../entities/role-permission.entity";

export const ROLE_PERMISSION_REPOSITORY = Symbol('ROLE_PERMISSION_REPOSITORY');

export interface RolePermissionRepository extends TemplateRepository<RolePermissionEntity>{

}