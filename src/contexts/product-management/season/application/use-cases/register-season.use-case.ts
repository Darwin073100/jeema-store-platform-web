import { SeasonEntity } from "../../domain/entities/season.entity";
import { SeasonRepository } from "../../domain/repositories/season.repository";
import { RegisterSeasonDto } from "../dtos/register-season.dto";

export class RegisterSeasonUseCase {
  constructor(private readonly seasonRepository: SeasonRepository) {}

  public async execute(command: RegisterSeasonDto): Promise<SeasonEntity> {
    const season = SeasonEntity.create(
      command.establishmentId,
      command.name,
      command.description,
      command.dateInit,
      command.dateFinish,
    );
    return this.seasonRepository.save(season);
  }
}
