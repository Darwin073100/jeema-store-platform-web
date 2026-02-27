import { ErrorEntity } from "@/shared/features/error.entity";
import { Result } from "@/shared/features/result";
import { RegisterUserWithEmployeeDTO } from "../../application/dtos/register-user-with-employee.dto";
import { UserEntity } from "../entities/user.entity";
import { RegisterUserDTO } from "../../application/dtos/register-user.dto";
import { UpdateUserDTO } from "../../application/dtos/update-user.dto";
import { UserRoleEntity } from "../entities/user-role.entity";
import { AddRoleToUserDTO } from "../../application/dtos/add-role-to-user.dto";
import { UpdateUserRoleDTO } from "../../application/dtos/update-user-role.dto";

export interface UserRepository{
    saveWithEmployee(dto: RegisterUserWithEmployeeDTO):Promise<Result<any, ErrorEntity>>;
    findAllByEstablishmentId(establishmentId: bigint): Promise<Result<{users: UserEntity[]}, ErrorEntity>>;
    save(dto: RegisterUserDTO): Promise<Result<UserEntity, ErrorEntity>>;
    update(establishmentId: bigint, userId: bigint, dto: UpdateUserDTO): Promise<Result<UserEntity, ErrorEntity>>;
    addRoleToUser(dto: AddRoleToUserDTO): Promise<Result<UserRoleEntity, ErrorEntity>>;
    updateUserRole(dto: UpdateUserRoleDTO): Promise<Result<UserRoleEntity, ErrorEntity>>;
    deleteUserRole(userRoleId: bigint): Promise<Result<void, ErrorEntity>>;
}