import { RoleEntity } from "../entities/role-entity";

export const ROLE_REPOSITORY = Symbol('ROLE_REPOSITORY');

export interface RoleRepository{
    save(entity: RoleEntity): Promise<RoleEntity>;
    findById(roleId: bigint): Promise<RoleEntity | null>;
    findByName(name: string): Promise<RoleEntity | null>;
    findAll(): Promise<RoleEntity[]>;
    existById(roleId: bigint):Promise<RoleEntity|null>;
}