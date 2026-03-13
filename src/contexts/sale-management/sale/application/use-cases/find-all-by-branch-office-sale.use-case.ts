import { SaleEntity } from "../../domain/entities/sale.entity";
import { SaleNotFoundException } from "../../domain/exceptions/sale-not-found.exception";
import { SaleRepository } from "../../domain/repositories/sale.repository";

export class FindAllByBranchOfficeSaleUseCase{
    constructor(
        private readonly repository: SaleRepository
    ){}

    async execute(branchOfficeId: bigint):Promise<SaleEntity[]>{
        try {
            const result = await this.repository.findAllByBranchOffice(branchOfficeId);
            if(!result || result.length === 0){
                throw new SaleNotFoundException('No se encontraron ventas para la sucursal con id ' + branchOfficeId );
            }
            return result;
        } catch (error) {
            throw error;
        }
    }
}