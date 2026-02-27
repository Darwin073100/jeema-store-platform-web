import { AddRoleToUserDTO } from "../../application/dtos/add-role-to-user.dto";
import { RegisterUserDTO } from "../../application/dtos/register-user.dto";
import { UpdateUserRoleDTO } from "../../application/dtos/update-user-role.dto";

export class UserMapper{
    static toRegisterUserHttpDTO(dto: RegisterUserDTO){
        const httpDto = {
            employeeId: dto.employeeId > BigInt(0)? dto.employeeId.toString() : undefined,
            roleId: dto.roleId.toString(),
            username: dto.username,
            email: dto.email,
            password: dto.passwordHash
        }
        return httpDto;
    }
    static toAddRoleToUserHttpDTO(dto: AddRoleToUserDTO){
        const httpDto = {
            userId: dto.userId.toString(),
            roleId: dto.roleId.toString(),
        }
        return httpDto;
    }
    static toUpdateUserRoleHttpDTO(dto: UpdateUserRoleDTO){
        const httpDto = {
            userRoleId: dto.userRoleId.toString(),
            roleId: dto.roleId.toString(),
        }
        return httpDto;
    }
}