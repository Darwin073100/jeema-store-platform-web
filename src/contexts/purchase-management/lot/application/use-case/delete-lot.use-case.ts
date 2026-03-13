import { LotRepository } from "../../domain/repositories/lot.repository";

export class DeleteLotUseCase{
    constructor(
        private readonly repository: LotRepository
    ){}

    async execute(entityId: bigint){
        return this.repository.delete(entityId);
    }
}