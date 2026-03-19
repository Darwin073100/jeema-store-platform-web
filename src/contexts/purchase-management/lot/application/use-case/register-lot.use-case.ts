import { LotEntity } from "../../domain/entities/lot.entity";
import { LotRepository } from "../../domain/repositories/lot.repository";
import { PurchasePriceVO } from "../../domain/value-objects/purchase-price.vo";
import { RegisterLotDto } from "../dtos/register-lot.dto";
import { ProductNotFoundException } from "src/contexts/product-management/product/domain/exceptions/product-not-found.exception";
import { LotUnitPurchaseEntity } from "../../domain/entities/lot-unit-purchase.entity";
import { LotPurchaseQuantityVO } from "../../domain/value-objects/lot-purchase-quantity.vo";
import { LotUnitsInPurchaseUnitVO } from "../../domain/value-objects/lot-units-in-purchase-unit.vo";
import { ProductRepository } from "@/contexts/product-management/product/domain/repositories/product.repository";

export class RegisterLotUseCase {
    constructor(
        private readonly lotRepository: LotRepository,
        private readonly productRepository: ProductRepository,
    ) { }

    async execute(dto: RegisterLotDto): Promise<LotEntity> {
        // Validar que el producto existe
        const productExists = await this.productRepository.existById(dto.productId);

        if (!productExists) {
            throw new ProductNotFoundException(`El producto con ID ${dto.productId} no existe.`);
        }

        const lot = LotEntity.reconstitute(
            BigInt(0),
            dto.productId,
            dto.suplierId,
            dto.lotNumber,
            dto.purchasePrice,
            dto.initialQuantity,
            dto.purchaseUnit,
            dto.receivedDate,
            dto.expirationDate,
            dto.manufacturingDate,
            new Date(),
            null,
            null,
            null,
            dto.lotUnitPurchases? dto.lotUnitPurchases?.map(item => {
                return LotUnitPurchaseEntity.create(
                    BigInt(new Date().getTime()),
                    PurchasePriceVO.create(item.purchasePrice),
                    LotPurchaseQuantityVO.create(item.purchaseQuantity),
                    item.unit,
                    LotUnitsInPurchaseUnitVO.create(item.unitsInPurchaseUnit)
                )
            }): null,
            null
        );


        const result = await this.lotRepository.saveWithItems(lot);

        return result;
    }
}