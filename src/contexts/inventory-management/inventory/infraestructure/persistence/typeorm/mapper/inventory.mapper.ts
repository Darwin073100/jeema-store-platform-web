import { InventoryEntity } from "src/contexts/inventory-management/inventory/domain/entities/inventory.entity";
import { InventoryOrmEntity } from "../entities/inventory.orm-entity";
import { InventorySalePriceOneVO } from "src/contexts/inventory-management/inventory/domain/value-objects/inventory-sale-price-one.vo";
import { InventorySalePriceManyVO } from "src/contexts/inventory-management/inventory/domain/value-objects/inventory-sale-price-many.vo";
import { InventoryMinStockBranchVO } from "src/contexts/inventory-management/inventory/domain/value-objects/inventory-min-stock-branch.vo";
import { InventoryMaxStockBranchVO } from "src/contexts/inventory-management/inventory/domain/value-objects/inventory-max-stock-branch.vo";
import { ProductTypeOrmMapper } from "src/contexts/product-management/product/infraestructure/persistence/typeorm/mappers/product.mapper";
import { BranchOfficeMapper } from "src/contexts/establishment-management/branch-office/infraestructure/persistence/typeorm/mappers/branch-office.mapper";
import { InventorySaleQuantityManyVO } from "src/contexts/inventory-management/inventory/domain/value-objects/inventory-sale-quantity-many.vo";
import { InventorySalePriceSpecialVO } from "src/contexts/inventory-management/inventory/domain/value-objects/inventory-sale-price-special.vo";
import { InventoryItemMapper } from "src/contexts/inventory-management/inventory-item/infraestructure/persistence/typeorm/mapper/inventory-item.mapper";
import { InventoryInternalBarCodeVO } from "src/contexts/inventory-management/inventory/domain/value-objects/inventory-internal-bar-code.vo";
import { TransferMapper } from "src/contexts/inventory-management/transfer/infraestructure/mappers/transfer.mapper";
import { ReturnsMapper } from "src/contexts/sale-management/returns/infraestructure/mappers/returns.mapper";

export class InventoryMapper {
    static toDomain(ormEntity: InventoryOrmEntity){
        const domainEntity = InventoryEntity.reconstitute(
            ormEntity.inventoryId,
            ormEntity.productId,
            ormEntity.branchOfficeId,
            ormEntity.isSellable,
            ormEntity.createdAt,
            InventoryInternalBarCodeVO.create(ormEntity.internalBarCode),
            InventorySalePriceOneVO.create(ormEntity.salePriceOne),
            InventorySalePriceManyVO.create(ormEntity.salePriceMany),
            InventorySaleQuantityManyVO.create(ormEntity.saleQuantityMany),
            InventorySalePriceSpecialVO.create(ormEntity.salePriceSpecial),
            InventoryMinStockBranchVO.create(ormEntity.minStockBranch),
            InventoryMaxStockBranchVO.create(ormEntity.maxStockBranch),
            ormEntity.product? ProductTypeOrmMapper.toDomain(ormEntity.product): null,
            ormEntity.branchOffice? BranchOfficeMapper.toDomainEntity(ormEntity.branchOffice): null,
            ormEntity.inventoryItems? ormEntity.inventoryItems.map(item => InventoryItemMapper.toDomain(item)): null,
            ormEntity.transfers? ormEntity.transfers.map(item => TransferMapper.toDomain(item)) : undefined,
            ormEntity.returns? ormEntity.returns.map(item => ReturnsMapper.toDomain(item)): null,
            ormEntity.updatedAt,
            ormEntity.deletedAt
        );
        return domainEntity;
    }

    static toOrmEntity(domainEntity: InventoryEntity){
        const ormEntity = new InventoryOrmEntity();
        ormEntity.inventoryId = domainEntity.inventoryId;
        ormEntity.productId = domainEntity.productId;
        ormEntity.branchOfficeId = domainEntity.branchOfficeId;
        ormEntity.isSellable = domainEntity.isSellable;
        ormEntity.createdAt = domainEntity.createdAt;
        ormEntity.internalBarCode = domainEntity.internalBarCode?.value;
        ormEntity.salePriceOne = domainEntity.salePriceOne?.value;
        ormEntity.salePriceMany = domainEntity.salePriceMany?.value ?? null;
        ormEntity.saleQuantityMany = domainEntity.saleQuantityMany?.value ?? null;
        ormEntity.salePriceSpecial = domainEntity.salePriceSpecial?.value ?? null;
        ormEntity.minStockBranch = domainEntity.minStockBranch?.value;
        ormEntity.maxStockBranch = domainEntity.maxStockBranch?.value;
        ormEntity.product = domainEntity.product ? ProductTypeOrmMapper.toOrm(domainEntity.product): null;
        ormEntity.branchOffice = domainEntity.branchOffice? BranchOfficeMapper.toOrmEntity(domainEntity.branchOffice): null;
        ormEntity.inventoryItems = domainEntity.inventoryItems? domainEntity.inventoryItems.map(item=> InventoryItemMapper.toOrmEntity(item)): undefined;
        ormEntity.transfers = domainEntity.transfers? domainEntity.transfers.map(item => TransferMapper.toOrmEntity(item)) : undefined;
        ormEntity.returns = domainEntity.returns? domainEntity.returns.map(item => ReturnsMapper.toOrm(item)) : null;
        ormEntity.updatedAt = domainEntity.updatedAt;
        ormEntity.deletedAt = domainEntity.deletedAt;

        return ormEntity;
    }
}