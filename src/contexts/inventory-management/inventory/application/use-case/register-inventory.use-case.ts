import { ProductCheckerPort } from "src/contexts/product-management/product/domain/ports/out/product-checker.port";
import { InventoryRepository } from "../../domain/repositories/inventory.repository";
import { InventoryRegisterDto } from "../dtos/inventory-register.dto";
import { BranchOfficeCheckerPort } from "src/contexts/establishment-management/branch-office/domain/ports/out/branch-office-checker.port";
import { InventoryEntity } from "../../domain/entities/inventory.entity";
import { InventorySalePriceOneVO } from "../../domain/value-objects/inventory-sale-price-one.vo";
import { InventorySalePriceManyVO } from "../../domain/value-objects/inventory-sale-price-many.vo";
import { InventoryMinStockBranchVO } from "../../domain/value-objects/inventory-min-stock-branch.vo";
import { InventoryMaxStockBranchVO } from "../../domain/value-objects/inventory-max-stock-branch.vo";
import { InventoryNotFoundException } from "../../domain/exceptions/inventory-not-found.exception";
import { InventorySaleQuantityManyVO } from "../../domain/value-objects/inventory-sale-quantity-many.vo";
import { InventorySalePriceSpecialVO } from "../../domain/value-objects/inventory-sale-price-special.vo";
import { InventoryInternalBarCodeVO } from "../../domain/value-objects/inventory-internal-bar-code.vo";

export class RegisterInventoryUseCase{
    constructor(
        private readonly inventoryRepository: InventoryRepository,
        private readonly productCheckerPort: ProductCheckerPort,
        private readonly branchOfficeCheckerPort: BranchOfficeCheckerPort
    ){

    }

    async execute(dto: InventoryRegisterDto){
        // 1. Verificar si el producto existe
        const productExists = await this.productCheckerPort.check(dto.productId);
        if(!productExists){
            throw new InventoryNotFoundException('El producto establecido no existe.');
        }
        // 4. Verificar si la sucursal existe
        const branchOfficeExists = await this.branchOfficeCheckerPort.existById(dto.branchOfficeId);
        if(!branchOfficeExists){
            throw new InventoryNotFoundException('La sucursal establecida no existe.');
        }

        // 5. PASAR LOS DATOS DEL DTO A LA ENTIDAD DE DOMINIO
        const inventoryItem = InventoryEntity.create(
            dto.productId,
            dto.branchOfficeId,
            dto.isSellable,
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