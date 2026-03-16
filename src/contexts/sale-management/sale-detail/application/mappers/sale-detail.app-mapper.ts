import { InventoryMapper } from "src/contexts/inventory-management/inventory/application/mapper/inventory.mapper";
import { SaleDetailEntity } from "../../domain/entities/sale-detail.entity";
import { SaleDetailResponseDto } from "../dtos/sale-detail-response.dto";
import { ReturnsAppMapper } from "src/contexts/sale-management/returns/application/mappers/returns-app.mapper";
import { ProductMapper } from "src/contexts/product-management/product/application/mappers/product.mapper";
import { SaleMapper } from "src/contexts/sale-management/sale/application/mappers/sale-mapper";
import { ISaleDetail } from "../../presentation/interfaces/ISaleDetail";

export class SaleDetailAppMapper{
    static toResponseDto(entity: SaleDetailEntity){
        const httpDto: SaleDetailResponseDto = {
            saleDetailId: entity.saleDetailId,
            discountItem: entity.discountItem,
            inventoryId: entity.inventoryItemId,
            notes: entity.notes ?? null,
            productBarCodeAtSale: entity.productBarCodeAtSale,
            productCategoryAtSale: entity.productCategoryAtSale ?? null,
            productDescriptionAtSale: entity.productDescriptionAtSale ?? null,
            productBrandAtSale: entity.productBrandAtSale ?? null,
            productId: entity.productId,
            productNameAtSale: entity.productNameAtSale,
            productUnitAtSale: entity.productUnitAtSale,
            saleFor: entity.saleFor,
            quantity: Number(entity.quantity),
            regularPriceAtSale: Number(entity.regularPriceAtSale),
            saleId: entity.saleId,
            subtotalItem: Number(entity.subtotalItem),
            unitPriceAtSale: Number(entity.unitPriceAtSale),
            createdAt: entity.createdAt,
            updatedAt: entity.updatedAt,
            deletedAt: entity.deletedAt,
            inventory: entity.inventory? InventoryMapper.toResponseDto(entity.inventory): null,
            product: entity.product? ProductMapper.toResponseDto(entity.product): null,
            sale: entity.sale? SaleMapper.toResponseDto(entity.sale): null,
            returns: entity.returns? entity.returns.map(item=> ReturnsAppMapper.toResponse(item)): [],
        }
        return httpDto;
    }
    static toIResponse(entity: SaleDetailEntity): ISaleDetail{
        return {
            saleDetailId: entity.saleDetailId,
            discountItem: entity.discountItem,
            inventoryId: entity.inventoryItemId,
            notes: entity.notes,
            productBarCodeAtSale: entity.productBarCodeAtSale,
            productCategoryAtSale: entity.productCategoryAtSale,
            productDescriptionAtSale: entity.productDescriptionAtSale ?? null,
            productBrandAtSale: entity.productBrandAtSale ?? null,
            productId: entity.productId,
            productNameAtSale: entity.productNameAtSale,
            productUnitAtSale: entity.productUnitAtSale,
            saleFor: entity.saleFor,
            quantity: Number(entity.quantity),
            regularPriceAtSale: Number(entity.regularPriceAtSale),
            saleId: entity.saleId,
            subtotalItem: Number(entity.subtotalItem),
            unitPriceAtSale: Number(entity.unitPriceAtSale),
            createdAt: entity.createdAt,
            updatedAt: entity.updatedAt,
            deletedAt: entity.deletedAt,
            inventory: entity.inventory? InventoryMapper.toIResponse(entity.inventory): null,
            product: entity.product? ProductMapper.toIResponse(entity.product): null,
            sale: entity.sale? SaleMapper.toIResponse(entity.sale): null,
            returns: entity.returns? entity.returns.map(item=> ReturnsAppMapper.toIResponse(item)): [],
        };
    }
}