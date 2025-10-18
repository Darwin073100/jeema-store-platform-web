import { Result } from "@/shared/features/result";
import { ErrorEntity } from "@/shared/features/error.entity";
import { AuthRepository } from "../domain/repositories/auth.repository";
import { AuthAccesTokenDTO } from "../application/dtos/auth.access-token.dto";
import { AuthLoginDTO } from "../application/dtos/auth.login.dto";
import { UserWorkspaceResponseDTO } from "../application/dtos/user-workspace-response.dto";

export class AuthFetchRepositoryImpl implements AuthRepository {
    private readonly URL = `${process.env.URL_EDYOF_PLATFORM_API}${process.env.PREFIX_EDYOF_PLATFORM_API}/auth`;

    async login(dto: AuthLoginDTO): Promise<Result<AuthAccesTokenDTO, ErrorEntity>> {
        try {
            const result = await fetch(`${this.URL}/login`,{
                method: 'POST',
                headers:{
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(dto)
            });  
            if(!result.ok){
                const error = await result.json() as ErrorEntity;
                return Result.failure(error);
            }

            const accessToken = await result.json() as AuthAccesTokenDTO;
            return Result.success(accessToken);
        } catch (error:any) {
            return Result.failure({
                error: error?.message || error,
                message: 'No se pudo conectar al backend',
                statusCode: 500,
                path: `${process.env.PREFIX_EDYOF_PLATFORM_API}/auth`,
                timestamp: new Date().toDateString(),
            } satisfies ErrorEntity);
        }
    }

    async userWorkspace(dto: AuthAccesTokenDTO): Promise<Result<UserWorkspaceResponseDTO, ErrorEntity>> {
        try {
            // Intentar primero con GET (más común para obtener información)
            let result = await fetch(`${this.URL}/workspace-info`,{
                method: 'GET',
                headers:{
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${dto.accessToken}`,
                },
            });

            // Si GET no funciona, intentar con POST
            if (!result.ok && result.status === 404) {
                result = await fetch(`${this.URL}/workspace-info`,{
                    method: 'POST',
                    headers:{
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${dto.accessToken}`,
                    },
                    body: JSON.stringify({}),
                });
            }
            
            if(!result.ok){
                const error = await result.json() as ErrorEntity;
                return Result.failure(error);
            }

            const workspaceData = await result.json() as UserWorkspaceResponseDTO;
            return Result.success(workspaceData);
        } catch (error:any) {
            return Result.failure({
                error: error?.message || error,
                message: 'No se pudo conectar al backend para obtener información del workspace',
                statusCode: 500,
                path: `${this.URL}/workspace-info`,
                timestamp: new Date().toISOString(),
            } satisfies ErrorEntity);
        }
    }
}