import { SeasonNotFoundException } from "../../domain/exceptions/season-not-found.exception";
import { SeasonRepository } from "../../domain/repositories/season.repository";

export class DeleteSeasonUseCase{
    constructor(
        private readonly seasonRepository: SeasonRepository,
    ){}

    async execute(entityId: bigint): Promise<void> {
        const season = await this.seasonRepository.findById(entityId);
        if (!season) {
            throw new SeasonNotFoundException('La temporada especificada no existe.');
        }

        await this.seasonRepository.delete(entityId);
    }
}