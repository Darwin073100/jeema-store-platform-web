import { SeasonEntity } from "../../domain/entities/season.entity";
import { SeasonResponseDto } from "../dtos/season-response.dto";

export class SeasonMapper {
  static toResponseDto(entity: SeasonEntity): SeasonResponseDto {
    return {
      seasonId: entity.seasonId,
      name: entity.name,
      description: entity.description ?? null,
      dateInit: entity.dateInit,
      dateFinish: entity.dateFinish,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      deletedAt: entity.deletedAt,
    };
  }
}
