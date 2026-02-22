import { Result } from "@/shared/features/result";
import { LotEntity } from "../entities/lot.entity";
import { ErrorEntity } from "@/shared/features/error.entity";
import { RegisterLotDTO } from "../../application/dtos/register-lot.dto";
import { UpdateLotDTO } from "../../application/dtos/update-lot.dto";
import { LotUnitPurchaseEntity } from "../entities/lot-unit-purchase.entity";
import { UpdateLotUnitPurchaseDTO } from "../../application/dtos/update-lot-unit-purchase.dto";
import { AddLotUnitPurchaseDTO } from "../../application/dtos/add-lot-unit-purchase.dto";
import { FindReportLotsDTO } from "../../application/dtos/find-report-lots.dto";

export interface LotRepository{
    save(dto: RegisterLotDTO):Promise<Result<LotEntity, ErrorEntity>>;
    update(dto: UpdateLotDTO):Promise<Result<LotEntity, ErrorEntity>>;
    addPurchaseUnit(dto: AddLotUnitPurchaseDTO):Promise<Result<LotUnitPurchaseEntity, ErrorEntity>>;
    updatePurchaseUnit(dto: UpdateLotUnitPurchaseDTO): Promise<Result<LotUnitPurchaseEntity, ErrorEntity>>;
    deleteLot(lotId: bigint): Promise<Result<any, ErrorEntity>|undefined>;
    deleteLotUnitPurchase(lotId: bigint, lotUnitPurchaseId: bigint): Promise<Result<any, ErrorEntity>|undefined>;
    findReportLots(branchOfficeId: bigint,dateInit: Date, dateFinish: Date): Promise<Result<{lots: LotEntity[]}, ErrorEntity>>;
}