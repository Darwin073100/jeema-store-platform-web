import { UserRoleRepository } from "../../domain/repositories/user-role.repository";
import { UserRoleEntity } from "../../domain/entities/user-role.entity";
import { NotFoundRoleException } from "src/contexts/authentication-management/role/domain/exceptions/not-found-role.exception";
import { UpdateUserRoleDTO } from "../dtos/update-user-role.dto";

/**
 * Este caso de uso(Clase), esta encargada de eliminar logicamente la relacion de un usuario y un rol.
 */
export class DeleteUserRoleUseCase{
    constructor(
        private readonly userRoleRepository: UserRoleRepository
    ){}

    async excecute(userRoleId: bigint):Promise<UserRoleEntity>{
        const userRoleExist = await this.userRoleRepository.existById(userRoleId);
        if(!userRoleExist){
            throw new NotFoundRoleException('No se pudo encontrar registro del rol y el usuario.');
        }
        
        userRoleExist.softDelete();
        const result = await this.userRoleRepository.update(userRoleExist);
        return result;
    }
}