import { Result } from "@/shared/features/result";
import { LotEntity } from "../entities/lot.entity";
import { ErrorEntity } from "@/shared/features/error.entity";
import { RegisterLotDTO } from "../../application/dtos/register-lot.dto";
import { UpdateLotDTO } from "../../application/dtos/update-lot.dto";
import { LotUnitPurchaseEntity } from "../entities/lot-unit-purchase.entity";
import { UpdateLotUnitPurchaseDTO } from "../../application/dtos/update-lot-unit-purchase.dto";
import { AddLotUnitPurchaseDTO } from "../../application/dtos/add-lot-unit-purchase.dto";

export interface LotRepository{
    save(dto: RegisterLotDTO):Promise<Result<LotEntity, ErrorEntity>>
    update(dto: UpdateLotDTO):Promise<Result<LotEntity, ErrorEntity>>
    addPurchaseUnit(dto: AddLotUnitPurchaseDTO):Promise<Result<LotUnitPurchaseEntity, ErrorEntity>>
    updatePurchaseUnit(dto: UpdateLotUnitPurchaseDTO): Promise<Result<LotUnitPurchaseEntity, ErrorEntity>>
}