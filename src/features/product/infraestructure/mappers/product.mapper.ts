import { RegisterCompleteProductDTO } from "../../application/dtos/register-complete-product.dto";
import { RegisterInitialProductDTO } from "../../application/dtos/register-initial-product.dto";
import { UpdateProductDTO } from "../../application/dtos/update-product.dto";
import { RegisterCompleteProductHttpDTO } from "../dtos/register-complete-product-http.dto";
import { RegisterInitialProductHttpDTO } from "../dtos/register-initial-product-http.dto";
import { UpdateProductHttpDTO } from "../dtos/update-product-http.dto";

export class ProductMapper{
    /**
     * Este metodo es usado para convertir la información ingresada en el formulario, a informacion que sea compatible con los JSONs del request
     * es informacion de Product, Lot e InventoryItem 
     */
    static toHttpMany(dto: RegisterInitialProductDTO): RegisterInitialProductHttpDTO {
        const result: RegisterInitialProductHttpDTO = {
            // Product
            establishmentId: dto.establishmentId,
            categoryId: dto.categoryId,
            brandId: dto.brandId,
            seasonId: dto.seasonId,
            name: dto.name,
            description: dto.description,
            universalBarCode: dto.universalBarCode,
            unitOfMeasure: dto.unitOfMeasure,
            minStockGlobal: dto.minStockGlobal,
            imageUrl: dto.imageUrl,
            
            // Lot
            lotNumber: dto.lotNumber,
            purchasePrice: dto.purchasePrice,
            initialQuantity: dto.initialQuantity,
            purchaseUnit: dto.purchaseUnit,
            expirationDate: dto.expirationDate?.toJSON() || null,
            manufacturingDate: dto.manufacturingDate?.toJSON() || null,
            receivedDate: dto.receivedDate.toJSON(),
            lotUnitPurchases: dto.lotUnitPurchases?.map(purchase => ({
                purchasePrice: purchase.purchasePrice,
                purchaseQuantity: purchase.purchaseQuantity,
                unit: purchase.unit,
                unitsInPurchaseUnit: purchase.unitsInPurchaseUnit
            })) || null,
            
            // InventoryItem
            branchOfficeId: dto.branchOfficeId,
            isSellable: dto.isSellable,
            salePriceOne: dto.salePriceOne,
            salePriceMany: dto.salePriceMany,
            salePriceSpecial: dto.salePriceSpecial,
            saleQuantityMany: dto.saleQuantityMany,
            minStockBranch: dto.minStockBranch,
            maxStockBranch: dto.maxStockBranch,
            internalBarCode: dto.internalBarCode,
            
            // Inventory Items array
            inventoryItems: dto.inventoryItems?.map(item => ({
                location: item.location,
                quantityOnHand: item.quantityOnHand,
                lastStockedAt: item.lastStockedAt.toJSON(),
                purchasePriceAtStock: item.purchasePriceAtStock

            })) || null
        };
        return result;
    }
    static toHttpRegisterCompleteProduct(dto: RegisterCompleteProductDTO): RegisterCompleteProductHttpDTO {
        const result: RegisterCompleteProductHttpDTO = {
            // product
            establishmentId: dto.establishmentId,
            categoryId: dto.categoryId,
            brandId: dto.brandId,
            seasonId: dto.seasonId,
            name: dto.name,
            description: dto.description ?? undefined,
            universalBarCode: dto.universalBarCode ?? undefined,
            unitOfMeasure: dto.unitOfMeasure,
            minStockGlobal: dto.minStockGlobal,
            imageUrl: dto.imageUrl ?? undefined,
            inventory: dto.inventory? {
                // InventoryItem
                branchOfficeId: dto.inventory.branchOfficeId.toString(),
                isSellable: dto.inventory.isSellable,
                salePriceOne: dto.inventory.salePriceOne ?? undefined,
                salePriceMany: (dto.inventory.salePriceMany && dto.inventory.salePriceMany > 0)?dto.inventory.salePriceMany:  undefined,
                salePriceSpecial: dto.inventory.salePriceSpecial ?? undefined,
                saleQuantityMany: (dto.inventory.saleQuantityMany && dto.inventory.saleQuantityMany > 0)? dto.inventory.saleQuantityMany: undefined,
                minStockBranch: dto.inventory.minStockBranch ?? undefined,
                maxStockBranch: dto.inventory.maxStockBranch ?? undefined,
                internalBarCode: dto.inventory.internalBarCode ?? undefined,
                
                // Inventory Items array
                inventoryItems: dto.inventory.inventoryItems?.map(item => ({
                    location: item.location,
                    quantityOnHand: item.quantityOnHand,
                    lastStockedAt: item.lastStockedAt.toJSON(),
                    purchasePriceAtStock: item.purchasePriceAtStock

                })) ?? undefined
            }: undefined,
            lot: dto.lot? {
                // Lot
                suplierId: dto.lot.suplierId ?? undefined,
                lotNumber: dto.lot.lotNumber,
                purchasePrice: dto.lot.purchasePrice,
                initialQuantity: dto.lot.initialQuantity,
                purchaseUnit: dto.lot.purchaseUnit,
                expirationDate: dto.lot.expirationDate?.toJSON() ?? undefined,
                manufacturingDate: dto.lot.manufacturingDate?.toJSON() ?? undefined,
                receivedDate: dto.lot.receivedDate.toJSON(),
                lotUnitPurchases: dto.lot.lotUnitPurchases?.map(purchase => ({
                    purchasePrice: purchase.purchasePrice,
                    purchaseQuantity: purchase.purchaseQuantity,
                    unit: purchase.unit,
                    unitsInPurchaseUnit: purchase.unitsInPurchaseUnit
                })) || null,
            }: undefined,
        };
        return result;
    }

    static toUpdateProductHttpDTO(dto: UpdateProductDTO){
        const httpDTO: UpdateProductHttpDTO = {
            productId: dto.productId.toString(),
            categoryId: dto.categoryId.toString(),
            seasonId: dto.seasonId?.toString(),
            brandId: dto.brandId?.toString(),
            name: dto.name,
            universalBarCode: dto.universalBarCode,
            unitOfMeasure: dto.unitOfMeasure,
            sku: dto.sku,
            minStockGlobal: dto.minStockGlobal,
            description: dto.description
        } 

        return httpDTO;
    }
}