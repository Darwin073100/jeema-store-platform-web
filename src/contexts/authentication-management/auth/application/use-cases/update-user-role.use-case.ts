import { UserRoleRepository } from "../../domain/repositories/user-role.repository";
import { UserRoleEntity } from "../../domain/entities/user-role.entity";
import { NotFoundRoleException } from "src/contexts/authentication-management/role/domain/exceptions/not-found-role.exception";
import { RoleRepository } from "src/contexts/authentication-management/role/domain/repositories/role.repository";
import { UpdateUserRoleDTO } from "../dtos/update-user-role.dto";
import { UserConflictException } from "../../domain/exceptions/user-conflict.exception";

/**
 * Este caso de uso(Clase), esta encargada de actualizar la relacion de un usuario y un rol.
 */
export class UpdateUserRoleUseCase{
    constructor(
        private readonly userRoleRepository: UserRoleRepository,
        private readonly roleRepository: RoleRepository,
    ){}

    async excecute(dto: UpdateUserRoleDTO):Promise<UserRoleEntity>{
        const userRoleExist = await this.userRoleRepository.existById(dto.userRoleId);
        if(!userRoleExist){
            throw new NotFoundRoleException('No se pudo encontrar registro del rol y el usuario.');
        }
        const roleExist = await this.roleRepository.existById(dto.roleId);
        if(!roleExist){
            throw new NotFoundRoleException('El rol asignado a este usuario no existe.');
        }
        const userWithRole = await this.userRoleRepository.existByRole(userRoleExist.userId, dto.roleId);
        if(userWithRole){
            if(userWithRole.userRoleId !== userRoleExist.userRoleId){
                throw new UserConflictException('No puede un usuario tener roles duplicados.');
            }
            userRoleExist
            return userRoleExist;
        } else {
            userRoleExist.updateRole(dto.roleId);
            const result = await this.userRoleRepository.update(userRoleExist);
            return result;
        }
    }
}