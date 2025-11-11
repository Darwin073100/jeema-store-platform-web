import { RegisterSeasonDTO } from "../../application/dtos/register-season.dto";
import { UpdateSeasonDTO } from "../../application/dtos/update-season.dto";
import { RegisterSeasonHttpDTO } from "../dtos/register-season-http.dto";
import { UpdateSeasonHttpDTO } from "../dtos/update-season-http.dto";

export class SeasonMapper{
    static toHttpDto(dto: RegisterSeasonDTO): RegisterSeasonHttpDTO {
        return {
            establishmentId: dto.establishmentId.toString(),
            name: dto.name,
            description: dto.description? dto.description: undefined,
            dateInit: dto.dateInit ? dto.dateInit.toISOString() : undefined,
            dateFinish: dto.dateFinish ? dto.dateFinish.toISOString() : undefined
        };

    }
    static toHttpUpdateDto(dto: UpdateSeasonDTO): UpdateSeasonHttpDTO {
        return {
            seasonId: dto.seasonId.toString(),
            name: dto.name,
            description: dto.description? dto.description: undefined,
            dateInit: dto.dateInit ? dto.dateInit.toISOString() : undefined,
            dateFinish: dto.dateFinish ? dto.dateFinish.toISOString() : undefined
        };

    }
}