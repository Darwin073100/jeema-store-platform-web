import { Result } from "@/shared/features/result";
import { SuplierRepository } from "../../domain/repositories/suplier.repository";

export class FindAllSuplierByEstablishmentUseCase {
    constructor(
        private readonly repository: SuplierRepository
    ){}

    async execute(establishmentId: bigint, isAddress: boolean){
        if(establishmentId<= BigInt(0)){
            return Result.success({supliers: []})
        }
        const result = await this.repository.findAllByEstablishmentId(establishmentId, isAddress);
        return result;
    }
}