import { UserRoleRepository } from "../../domain/repositories/user-role.repository";
import { UserRoleEntity } from "../../domain/entities/user-role.entity";
import { NotFoundRoleException } from "src/contexts/authentication-management/role/domain/exceptions/not-found-role.exception";
import { UserNotFoundException } from "../../domain/exceptions/user-not-found.exception";
import { UserRepository } from "../../domain/repositories/user.repository";
import { RoleRepository } from "src/contexts/authentication-management/role/domain/repositories/role.repository";
import { AddRoleToUserDTO } from "../dtos/add-role-to-user.dto";

/**
 * Este caso de uso(Clase), esta encargada de agregar roles a un usuario.
 */
export class AddRoleToUserUseCase{
    constructor(
        private readonly userRoleRepository: UserRoleRepository,
        private readonly userRepository: UserRepository,
        private readonly roleRepository: RoleRepository,
    ){}

    async excecute(dto: AddRoleToUserDTO):Promise<UserRoleEntity>{
        const userWithRole = await this.userRoleRepository.existByRole(dto.userId, dto.roleId);
        if(userWithRole){
            throw new NotFoundRoleException('El usuario ya tiene ese rol asignado.');
        }
        const userExist = await this.userRepository.existById(dto.userId);
        if(!userExist){
            throw new UserNotFoundException('No se encontró el usuario seleccionado.');
        }
        const roleExist = await this.roleRepository.existById(dto.roleId);
        if(!roleExist){
            throw new NotFoundRoleException('El rol asignado a este usuario no existe.');
        }

        const userRole = UserRoleEntity.create(dto.userId, dto.roleId);

        const resp = await  this.userRoleRepository.saveSecondImpl(userRole);

        return resp;
    }
}