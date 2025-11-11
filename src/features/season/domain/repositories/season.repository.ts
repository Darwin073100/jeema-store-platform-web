import { Result } from "@/shared/features/result"
import { SeasonEntity } from "../entities/season.entity"
import { ErrorEntity } from "@/shared/features/error.entity"
import { RegisterSeasonDTO } from "../../application/dtos/register-season.dto"
import { UpdateSeasonDTO } from "../../application/dtos/update-season.dto"

export interface SeasonRepository{
    save(dto: RegisterSeasonDTO): Promise<Result<SeasonEntity, ErrorEntity>>
    update(dto: UpdateSeasonDTO): Promise<Result<SeasonEntity, ErrorEntity>>
    delete(seasonId: bigint): Promise<Result<boolean, ErrorEntity>>
    findAll(): Promise<Result<{seasons: SeasonEntity[]}, ErrorEntity>>
    findAllSeasonsByEstablishment(establishmentId: bigint): Promise<Result<{ seasons: SeasonEntity[]; }, ErrorEntity>>
}