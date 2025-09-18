import { Result } from "@/shared/features/result";
import { SaleEntity } from "../entities/sale-entity";
import { ErrorEntity } from "@/shared/features/error.entity";
import { RegisterSaleDto } from "../../application/dtos/register-sale.dto";
import { AddDetailToSaleDto } from "../../application/dtos/add-detail-to-sale.dto";
import { SaleDetailEntity } from "../entities/sale-detail-entity";

export interface SaleRepository {
    save(dto: RegisterSaleDto):Promise<Result<SaleEntity, ErrorEntity>>;
    findSaleWithDetails(saleId: bigint): Promise<Result<SaleEntity, ErrorEntity>>;
    addDetailToSale(saleId: bigint, dto: AddDetailToSaleDto): Promise<Result<SaleDetailEntity, ErrorEntity>>;
}