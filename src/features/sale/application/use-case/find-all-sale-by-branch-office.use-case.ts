import { Result } from "@/shared/features/result";
import { SaleRepository } from "../../domain/repositories/sale.repository";
import { ErrorEntity } from "@/shared/features/error.entity";

export class FindAllSaleByBranchOfficeUseCase {
    constructor(
        private readonly repository: SaleRepository
    ){}

    async execute(branchOfficeId: bigint){
        if(branchOfficeId === BigInt(0)){
            return Result.failure<ErrorEntity>({
                error: '400: !Error en el id¡',
                message: 'El id de la sucursal es invalido',
                path: '/sale/all/branchOffice',
                statusCode: 400,
                timestamp: new Date().toJSON().toString()
            });
        }
        const result = await this.repository.findAllByBranchOffice(branchOfficeId);
        return result;
    }
}