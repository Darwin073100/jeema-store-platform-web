import { ErrorEntity } from "@/shared/features/error.entity";
import { Result } from "@/shared/features/result";
import { RegisterUserWithEmployeeDTO } from "../../application/dtos/register-user-with-employee.dto";
import { UserEntity } from "../entities/user.entity";
import { RegisterUserDTO } from "../../application/dtos/register-user.dto";
import { UpdateUserDTO } from "../../application/dtos/update-user.dto";

export interface UserRepository{
    saveWithEmployee(dto: RegisterUserWithEmployeeDTO):Promise<Result<any, ErrorEntity>>;
    findAllByEstablishmentId(establishmentId: bigint): Promise<Result<{users: UserEntity[]}, ErrorEntity>>;
    save(dto: RegisterUserDTO): Promise<Result<UserEntity, ErrorEntity>>;
    update(establishmentId: bigint, userId: bigint, dto: UpdateUserDTO): Promise<Result<UserEntity, ErrorEntity>>;
}