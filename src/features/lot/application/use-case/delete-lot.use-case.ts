import { LotRepository } from "../../domain/repositories/lot.repository";

export class DeleteLotUseCase{
    constructor(
        private readonly repository: LotRepository
    ){}

    async execute(lotId: bigint){
        const result = await this.repository.deleteLot(lotId);
        return result; 
    }
}