import { Result } from "@/shared/features/result";
import { SaleRepository } from "../../domain/repositories/sale.repository";
import { RegisterSaleDto } from "../dtos/register-sale.dto";
import { ErrorEntity } from "@/shared/features/error.entity";

export class RegisterSaleInitialUseCase {
    constructor(
        private readonly repository: SaleRepository
    ){}

    async execute(dto: RegisterSaleDto){
        if(dto.customerId <= BigInt(0)){
            return Result.failure<ErrorEntity>({
                error: 'Cliente no identificado',
                message: 'Asegurate de tener creado el cliente Publico en General, por defecto.',
                path: 'RegisterSaleInitialUseCase',
                statusCode: 500,
                timestamp: new Date().toISOString()
            });
        }
        const result = await this.repository.save(dto);
        return result;
    }
}