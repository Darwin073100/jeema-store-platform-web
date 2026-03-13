import { SeasonRepository } from "../../domain/repositories/season.repository";

export class FindAllSeasonsByEstablishmentUseCase{
    constructor(
        private readonly repository: SeasonRepository,
    ){}

    async execute(establishmentId: bigint){
        const result = await this.repository.findAllByEstablishment(establishmentId);
        return result;
    }
}