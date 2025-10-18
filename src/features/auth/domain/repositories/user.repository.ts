import { ErrorEntity } from "@/shared/features/error.entity";
import { Result } from "@/shared/features/result";
import { RegisterUserWithEmployeeDTO } from "../../application/dtos/register-user-with-employee.dto";
import { UserEntity } from "../entities/user.entity";

export interface UserRepository{
    saveWithEmployee(dto: RegisterUserWithEmployeeDTO):Promise<Result<any, ErrorEntity>>;
    findAllByEstablishmentId(establishmentId: bigint): Promise<Result<{users: UserEntity[]}, ErrorEntity>>
}