import { ErrorEntity } from "@/shared/features/error.entity";
import { SuplierRepository } from "../../domain/repositories/suplier.repository";
import { RegisterSuplierDto } from "../dtos/register-suplier.dto";
import { Result } from "@/shared/features/result";

export class RegisterSuplierUseCase {
    constructor(
        private readonly repository: SuplierRepository
    ){}

    async execute(dto: RegisterSuplierDto){
        if(dto.establishmentId === BigInt(0)){
            return Result.failure<ErrorEntity>({
                error: '!Error en el id¡',
                message: 'El id del establecimiento es invalido',
                path: 'RegisterSuplierUseCase',
                statusCode: 404,
                timestamp: new Date().toJSON().toString()
            });
        }
        const result = await this.repository.registerSuplier(dto);
        return result;
    }
}