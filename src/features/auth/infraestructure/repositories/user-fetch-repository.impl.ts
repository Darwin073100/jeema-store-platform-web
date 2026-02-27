import { Result } from "@/shared/features/result";
import { ErrorEntity } from "@/shared/features/error.entity";
import { UserRepository } from "../../domain/repositories/user.repository";
import { RegisterUserWithEmployeeDTO } from "../../application/dtos/register-user-with-employee.dto";
import { HttpClient } from "@/shared/infrastructure/http/http-client.interface";
import { ApiConfig } from "@/shared/infrastructure/config/api-config";
import { UserEntity } from "../../domain/entities/user.entity";
import { RegisterUserDTO } from "../../application/dtos/register-user.dto";
import { UserMapper } from "../mappers/user.mapper";
import { UpdateUserDTO } from "../../application/dtos/update-user.dto";
import { handleError } from "@/shared/infrastructure/http/handlers/handleError";
import { UpdateUserRoleDTO } from "../../application/dtos/update-user-role.dto";
import { UserRoleEntity } from "../../domain/entities/user-role.entity";
import { UpdateUserRoleHttpDTO } from "../dtos/update-user-role-http.dto";
import { AddRoleToUserDTO } from "../../application/dtos/add-role-to-user.dto";
import { AddRoleToUserHttpDTO } from "../dtos/add-role-to-user-http.dto";

export class UserFetchRepositoryImpl implements UserRepository {
    constructor(
        private readonly httpClient: HttpClient,
        private readonly apiConfig: ApiConfig
    ) {}

    async saveWithEmployee(dto: RegisterUserWithEmployeeDTO): Promise<Result<any, ErrorEntity>> {
        try {
            const result = await this.httpClient.post<any>(
                this.apiConfig.getEndpointUrl(`/users/with-employee`),
                dto
            );

            return Result.success(result.data);
        } catch (error:any) {
           return handleError(error, 'Error al guardar usuario.');
        }
    }
    async save(dto: RegisterUserDTO): Promise<Result<UserEntity, ErrorEntity>> {
        const httpDTO = UserMapper.toRegisterUserHttpDTO(dto);
        try {
            const result = await this.httpClient.post<UserEntity>(
                this.apiConfig.getEndpointUrl(`/users`),
                httpDTO
            );

            return Result.success(result.data);
        } catch (error:any) {
           return handleError(error, 'Error al guardar usuario.');
        }
    }
    async update(establishmentId: bigint, userId: bigint, dto: UpdateUserDTO): Promise<Result<UserEntity, ErrorEntity>> {
        try {
            const result = await this.httpClient.patch<UserEntity>(
                this.apiConfig.getEndpointUrl(`/users/${userId.toString()}/establishments/${establishmentId.toString()}`),
                dto
            );

            return Result.success(result.data);
        } catch (error:any) {
           return handleError(error, 'Error al actualizar usuario.');
        }
    }
    
    async findAllByEstablishmentId(establishmentId: bigint): Promise<Result<{users: UserEntity[]}, ErrorEntity>> {
        try {
            const result = await this.httpClient.get<{users: UserEntity[]}>(
                this.apiConfig.getEndpointUrl(`/users/all/establishments/${establishmentId.toString()}`)
            );

            return Result.success(result.data);
        } catch (error:any) {
           return handleError(error, 'Error al traer los usuarios');
        }
    }

    async addRoleToUser(dto: AddRoleToUserDTO): Promise<Result<UserRoleEntity, ErrorEntity>> {
        try {
            const httpDto: AddRoleToUserHttpDTO = UserMapper.toAddRoleToUserHttpDTO(dto);
            const result = await this.httpClient.post<UserRoleEntity>(
                this.apiConfig.getEndpointUrl(`/users/add-role`),
                httpDto
            );

            return Result.success(result.data);
        } catch (error:any) {
           return handleError(error, 'Agregar un rol al usuario');
        }
    }

    async updateUserRole(dto: UpdateUserRoleDTO): Promise<Result<UserRoleEntity, ErrorEntity>> {
        try {
            const httpDto: UpdateUserRoleHttpDTO = UserMapper.toUpdateUserRoleHttpDTO(dto);
            const result = await this.httpClient.patch<UserRoleEntity>(
                this.apiConfig.getEndpointUrl(`/users/user-role`),
                httpDto
            );

            return Result.success(result.data);
        } catch (error:any) {
           return handleError(error, 'Error al actualizar usuario.');
        }
    }

    async deleteUserRole(userRoleId: bigint): Promise<Result<void, ErrorEntity>> {
        try {
            const result = await this.httpClient.delete<void>(
                this.apiConfig.getEndpointUrl(`/users/user-role/${userRoleId.toString()}`)
            );

            return Result.success(result.data);
        } catch (error:any) {
           return handleError(error, 'Error al eliminar el rol');
        }
    }
}