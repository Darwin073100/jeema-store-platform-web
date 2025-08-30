import { Result } from "@/shared/features/result";
import { LotEntity } from "../entities/lot.entity";
import { ErrorEntity } from "@/shared/features/error.entity";
import { RegisterLotDTO } from "../../application/dtos/register-lot.dto";
import { UpdateLotDTO } from "../../application/dtos/update-lot.dto";

export interface LotRepository{
    save(dto: RegisterLotDTO):Promise<Result<LotEntity, ErrorEntity>>
    update(dto: UpdateLotDTO):Promise<Result<LotEntity, ErrorEntity>>
}