import { ProductCheckerPort } from "src/contexts/product-management/product/domain/ports/out/product-checker.port";
import { InventoryRepository } from "../../domain/repositories/inventory.repository";
import { BranchOfficeCheckerPort } from "src/contexts/establishment-management/branch-office/domain/ports/out/branch-office-checker.port";
import { InventoryEntity } from "../../domain/entities/inventory.entity";
import { InventorySalePriceOneVO } from "../../domain/value-objects/inventory-sale-price-one.vo";
import { InventorySalePriceManyVO } from "../../domain/value-objects/inventory-sale-price-many.vo";
import { InventoryMinStockBranchVO } from "../../domain/value-objects/inventory-min-stock-branch.vo";
import { InventoryMaxStockBranchVO } from "../../domain/value-objects/inventory-max-stock-branch.vo";
import { InventoryNotFoundException } from "../../domain/exceptions/inventory-not-found.exception";
import { InventorySaleQuantityManyVO } from "../../domain/value-objects/inventory-sale-quantity-many.vo";
import { InventorySalePriceSpecialVO } from "../../domain/value-objects/inventory-sale-price-special.vo";
import { UpdateInventoryDto } from "../dtos/update-inventory.dto";
import { InventoryInternalBarCodeVO } from "../../domain/value-objects/inventory-internal-bar-code.vo";
import { InventoryConflictException } from "../../domain/exceptions/inventory-conflict.exception";
import { ProductRepository } from "@/contexts/product-management/product/domain/repositories/product.repository";
import { BranchOfficeRepository } from "@/contexts/establishment-management/branch-office/domain/repositories/branch-office.repository";

export class UpdateInventoryUseCase{
    constructor(
        private readonly inventoryRepository: InventoryRepository,
        private readonly productRepository: ProductRepository,
        private readonly branchOfficeRepository: BranchOfficeRepository
    ){

    }

    async execute(dto: UpdateInventoryDto){
        // 1. Verificar si el producto existe
        const productExists = await this.productRepository.existById(dto.productId);
        if(!productExists){
            throw new InventoryNotFoundException('El producto establecido no existe.');
        }
        // 4. Verificar si la sucursal existe
        const branchOfficeExists = await this.branchOfficeRepository.existById(dto.branchOfficeId);
        if(!branchOfficeExists){
            throw new InventoryNotFoundException('La sucursal establecida no existe.');
        }
        if(dto.internalBarCode){
            const inventoryVerify = await this.inventoryRepository.findByInternalBarCodeInBranchOffice(dto.internalBarCode, dto.branchOfficeId);
            if(inventoryVerify){
                if(
                    inventoryVerify.internalBarCode?.value?.trim().toUpperCase() === dto.internalBarCode.trim().toUpperCase() && 
                    inventoryVerify.inventoryId != dto.inventoryId
                ){
                    throw new InventoryConflictException('El código de barra interno ingresado ya está en uso.');
                }
            }
        }

        // 5. PASAR LOS DATOS DEL DTO A LA ENTIDAD DE DOMINIO
        const inventoryItem = InventoryEntity.reconstitute(
            dto.inventoryId,
            dto.productId,
            dto.branchOfficeId,
            dto.isSellable,
            new Date(),
            InventoryInternalBarCodeVO.create(dto.internalBarCode),
            InventorySalePriceOneVO.create(dto.salePriceOne),
            InventorySalePriceManyVO.create(dto.salePriceMany),
            InventorySaleQuantityManyVO.create(dto.saleQuantityMany),
            InventorySalePriceSpecialVO.create(dto.salePriceSpecial),
            InventoryMinStockBranchVO.create(dto.minStockBranch),
            InventoryMaxStockBranchVO.create(dto.maxStockBranch),
        );
        // 6. GUARDAR EN EL REPOSITORIO
        const savedInventory = await this.inventoryRepository.save(inventoryItem);
        // 7. DEVOLVER LA ENTIDAD GUARDADA
        return savedInventory;
    }
}