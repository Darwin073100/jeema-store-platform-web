import { SuplierRepository } from "../../domain/repositories/suplier.repository";

export class FindAllSuplierByEstablishmentUseCase {
    constructor(
        private readonly repository: SuplierRepository
    ){}

    async execute(establishmentId: bigint, isAddress: boolean){
        const result = await this.repository.findAllByEstablishmentId(establishmentId, isAddress);
        return result;
    }
}