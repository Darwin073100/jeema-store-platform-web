import { SeasonEntity } from "../../domain/entities/season.entity";
import { SeasonNotFoundException } from "../../domain/exceptions/season-not-found.exception";
import { SeasonRepository } from "../../domain/repositories/season.repository";
import { UpdateSeasonDto } from "../dtos/update-season.dto";

export class UpdateSeasonUseCase{
    constructor(
        private readonly seasonRepository: SeasonRepository,
    ){}

    async execute(dto: UpdateSeasonDto): Promise<SeasonEntity> {
        const season = await this.seasonRepository.findById(dto.seasonId);
        if (!season) {
            throw new SeasonNotFoundException('La temporada especificada no existe.');
        }
        if(dto.name !== undefined){
            season.updateName(dto.name);
        }
        if(dto.description !== undefined){
            season.updateDescription(dto.description);
        }
        if(dto.dateInit !== undefined){
            season.updateDateInit(dto.dateInit);
        }
        if(dto.dateFinish !== undefined){
            season.updateDateFinish(dto.dateFinish);
        }
        return this.seasonRepository.save(season);
    }
}