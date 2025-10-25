import { RegisterUserDTO } from "../../application/dtos/register-user.dto";
import { RegisterUserHttpDTO } from "../dtos/register-user-http.dto";

export class UserMapper{
    public static toRegisterUserHttpDTO(dto: RegisterUserDTO){
        const httpDto: RegisterUserHttpDTO = {
            employeeId: dto.employeeId.toString(),
            roleId: dto.roleId.toString(),
            username: dto.username,
            email: dto.email,
            passwordHash: dto.passwordHash
        }
        return httpDto;
    }
}