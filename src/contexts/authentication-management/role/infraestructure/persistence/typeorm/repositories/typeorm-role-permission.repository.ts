import { DataSource, Repository } from "typeorm";
import { RolePermissionRepository } from "src/contexts/authentication-management/role/domain/repositories/role-permission.repositoy";
import { RolePermissionEntity } from "src/contexts/authentication-management/role/domain/entities/role-permission.entity";
import { RolePermissionOrmEntity } from "../entities/role-permission.orm-entity";
import { RoleOrmEntity } from "../entities/role.orm-entity";
import { RoleAlreadyExistException } from "src/contexts/authentication-management/role/domain/exceptions/role-already.exception";
import { RolePermissionMapper } from "../mappers/role-permission.mapper";
import { getDataSource } from "@/configuration/databases/typeorm/config";

export class TypeormRolePermissionRepository implements RolePermissionRepository{
    private rolePermissionRepository: Repository<RolePermissionOrmEntity>;
    private roleRepository: Repository<RoleOrmEntity>;
    
    constructor(private readonly datasource: DataSource){
        this.rolePermissionRepository = this.datasource.getRepository(RolePermissionOrmEntity);
        this.roleRepository = this.datasource.getRepository(RoleOrmEntity);
    }

    /**
     * Crea una instancia del repositorio (factory)
     * Uso: const repo = await TypeOrmAgregadoRepository.create();
     */
    static async create(): Promise<TypeormRolePermissionRepository> {
        const dataSource = await getDataSource();
        return new TypeormRolePermissionRepository(dataSource);
    }
    
    async save(entity: RolePermissionEntity):Promise<RolePermissionEntity>{
        const ormEntity = RolePermissionMapper.toOrmEntity(entity);
        // ...removed console.log...
        const isValidRoleName = await this.roleRepository.findOne({where:{name: ormEntity.role?.name}});
        if(isValidRoleName){
            throw new RoleAlreadyExistException('El nombre del rol ya existe.');
        }

        const result = await this.rolePermissionRepository.save(ormEntity);
        return RolePermissionMapper.toDomain(result);
    }

    delete(entityId: bigint): Promise<RolePermissionEntity | null> {
        throw new Error('Este metodo no esta implementado.');
    }
    
    findAll(): Promise<RolePermissionEntity[] | []> {
        throw new Error('Este metodo no esta implementado.');
    }
    
    findById(entityId: bigint): Promise<RolePermissionEntity | null> {
        throw new Error('Este metodo no esta implementado.');
    }
}