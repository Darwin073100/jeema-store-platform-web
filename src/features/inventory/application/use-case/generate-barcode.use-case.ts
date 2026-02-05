import { InventoryRepository } from "../../domain/repositories/inventory-repository";

export class GenerateBarcodeUseCase{
    constructor(
        private readonly repository: InventoryRepository,
    ){}

    async execute(establishmentId: bigint, branchOfficeId: bigint){
        const result = await this.repository.generateBarcode(establishmentId, branchOfficeId);
        return result;
    }
}