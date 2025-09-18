import { Result } from "@/shared/features/result";
import { SaleEntity } from "../entities/sale-entity";
import { ErrorEntity } from "@/shared/features/error.entity";
import { RegisterSaleDto } from "../../application/dtos/register-sale.dto";

export interface SaleRepository {
    save(dto: RegisterSaleDto):Promise<Result<SaleEntity, ErrorEntity>>;
    findSaleWithDetails(saleId: bigint): Promise<Result<SaleEntity, ErrorEntity>>;
}