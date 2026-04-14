import { SuplierRepository } from "../../domain/repositories/suplier.repository";

export class FindSuplierByIdUseCase {
    constructor(
        private readonly suplierRepository: SuplierRepository
    ){}

    async execute(suplierId: bigint){
        if(suplierId <= BigInt(0)){
            return null;
        }
        const result = await this.suplierRepository.findById(suplierId);
        return result;
    }
}