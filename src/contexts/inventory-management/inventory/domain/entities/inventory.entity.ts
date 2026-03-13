import { BranchOfficeEntity } from "src/contexts/establishment-management/branch-office/domain/entities/branch-office.entity";
import { ProductEntity } from "src/contexts/product-management/product/domain/entities/product.entity";
import { LotEntity } from "src/contexts/purchase-management/lot/domain/entities/lot.entity";
import { InventorySalePriceOneVO } from "../value-objects/inventory-sale-price-one.vo";
import { InventorySalePriceManyVO } from "../value-objects/inventory-sale-price-many.vo";
import { InventoryMinStockBranchVO } from "../value-objects/inventory-min-stock-branch.vo";
import { InventoryMaxStockBranchVO } from "../value-objects/inventory-max-stock-branch.vo";
import { InventorySalePriceSpecialVO } from "../value-objects/inventory-sale-price-special.vo";
import { InventorySaleQuantityManyVO } from "../value-objects/inventory-sale-quantity-many.vo";
import { InventoryItemEntity } from "src/contexts/inventory-management/inventory-item/domain/entities/inventory-item.entity";
import { InventoryInternalBarCodeVO } from "../value-objects/inventory-internal-bar-code.vo";
import { TransferEntity } from "src/contexts/inventory-management/transfer/domain/entities/transafer.entity";
import { ReturnsEntity } from "src/contexts/sale-management/returns/domain/entities/returns.entity";

export class InventoryEntity{
    private readonly _inventoryId : bigint;
    private _productId            : bigint;
    private _branchOfficeId       : bigint;
    private _internalBarCode?     : InventoryInternalBarCodeVO | null;
    private _salePriceOne?        : InventorySalePriceOneVO | null;
    private _salePriceMany?       : InventorySalePriceManyVO | null;
    private _saleQuantityMany?    : InventorySaleQuantityManyVO | null;
    private _salePriceSpecial?    : InventorySalePriceSpecialVO | null;
    private _minStockBranch?      : InventoryMinStockBranchVO | null;
    private _maxStockBranch?      : InventoryMaxStockBranchVO | null;
    private _isSellable           : boolean;
    private _product?             : ProductEntity | null;
    private _branchOffice?        : BranchOfficeEntity | null;
    private _inventoryItems?      : InventoryItemEntity[] | null;
    private _transfers?           : TransferEntity[];
    private _returns?             : ReturnsEntity[] | null;
    private readonly _createdAt   : Date;
    private _updatedAt?           : Date | null;
    private _deletedAt?           : Date | null;

    constructor(
        inventoryId      : bigint,
        productId            : bigint,
        branchOfficeId       : bigint,
        isSellable           : boolean,
        createdAt            : Date,
        internalBarCode?     : InventoryInternalBarCodeVO | null,
        salePriceOne?        : InventorySalePriceOneVO | null,
        salePriceMany?       : InventorySalePriceManyVO | null,
        saleQuantityMany? : InventorySaleQuantityManyVO | null,
        salePriceSpecial? : InventorySalePriceSpecialVO | null,
        minStockBranch?      : InventoryMinStockBranchVO | null,
        maxStockBranch?      : InventoryMaxStockBranchVO | null,
        product?             : ProductEntity | null,
        branchOffice?        : BranchOfficeEntity | null,
        inventoryItems?          : InventoryItemEntity[] | null,
        transfers?           : TransferEntity[],
        returns?             : ReturnsEntity[] | null,
        updatedAt?           : Date | null,
        deletedAt?           : Date | null,
    ){
        this._internalBarCode  = internalBarCode;
        this._inventoryId      = inventoryId;
        this._productId        = productId;
        this._branchOfficeId   = branchOfficeId;
        this._isSellable       = isSellable;
        this._createdAt        = createdAt;
        this._salePriceOne     = salePriceOne;
        this._salePriceMany    = salePriceMany;
        this._saleQuantityMany = saleQuantityMany;
        this._salePriceSpecial = salePriceSpecial;
        this._minStockBranch   = minStockBranch;
        this._maxStockBranch   = maxStockBranch;
        this._product          = product;
        this._branchOffice     = branchOffice;
        this._inventoryItems   = inventoryItems;
        this._transfers        = transfers;
        this._returns = returns;
        this._updatedAt        = updatedAt;
        this._deletedAt        = deletedAt;

    }
    get inventoryId(){
        return this._inventoryId;
    }

    get internalBarCode(){
        return this._internalBarCode;
    }
    get productId(){
        return this._productId;
    }
    get branchOfficeId(){
        return this._branchOfficeId;
    }
    get salePriceOne(){
        return this._salePriceOne;
    }
    get salePriceMany(){
        return this._salePriceMany;
    }
    get saleQuantityMany(){
        return this._saleQuantityMany;
    }
    get salePriceSpecial(){
        return this._salePriceSpecial;
    }
    get minStockBranch(){
        return this._minStockBranch;
    }
    get maxStockBranch(){
        return this._maxStockBranch;
    }
    get isSellable(){
        return this._isSellable;
    }
    get createdAt(){
        return this._createdAt;
    }
    get updatedAt(){
        return this._updatedAt;
    }
    get deletedAt(){
        return this._deletedAt;
    }
    get product(){
        return this._product;
    }
    get branchOffice(){
        return this._branchOffice;
    }
    get inventoryItems(){
        return this._inventoryItems;
    }
    get transfers(){
        return this._transfers;
    }
    get returns(){ return this._returns;}


    static create(
        productId         : bigint,
        branchOfficeId    : bigint,
        isSellable        : boolean,
        internalBarCode?  : InventoryInternalBarCodeVO | null,
        salePriceOne?     : InventorySalePriceOneVO | null,
        salePriceMany?    : InventorySalePriceManyVO | null,
        saleQuantityMany? : InventorySaleQuantityManyVO | null,
        salePriceSpecial? : InventorySalePriceSpecialVO | null,
        minStockBranch?   : InventoryMinStockBranchVO | null,
        maxStockBranch?   : InventoryMaxStockBranchVO | null,
    ){
        const inventory = new InventoryEntity(
            BigInt(new Date().getDate()),
            productId,
            branchOfficeId,
            isSellable,
            new Date(),
            internalBarCode,
            salePriceOne,
            salePriceMany,
            saleQuantityMany,
            salePriceSpecial,
            minStockBranch,
            maxStockBranch,
            null,
            null,
            null,
            undefined,
            null,
            null
        );
        return inventory; 
    }

    static reconstitute(
        inventoryItemId      : bigint,
        productId            : bigint,
        branchOfficeId       : bigint,
        isSellable           : boolean,
        createdAt            : Date,
        internalBarCode?     : InventoryInternalBarCodeVO | null,
        salePriceOne?        : InventorySalePriceOneVO | null,
        salePriceMany?       : InventorySalePriceManyVO | null,
        saleQuantityMany? : InventorySaleQuantityManyVO | null,
        salePriceSpecial? : InventorySalePriceSpecialVO | null,
        minStockBranch?      : InventoryMinStockBranchVO | null,
        maxStockBranch?      : InventoryMaxStockBranchVO | null,
        product?             : ProductEntity | null,
        branchOffice?        : BranchOfficeEntity | null,
        inventoryItems?      : InventoryItemEntity[] | null,
        transfers?           : TransferEntity[],
        returns?             : ReturnsEntity[] | null,
        updatedAt?           : Date | null,
        deletedAt?           : Date | null,
    ){
        const inventory = new InventoryEntity(
            inventoryItemId,
            productId,
            branchOfficeId,
            isSellable,
            createdAt,
            internalBarCode,
            salePriceOne,
            salePriceMany,
            saleQuantityMany,
            salePriceSpecial,
            minStockBranch,
            maxStockBranch,
            product,
            branchOffice,
            inventoryItems,
            transfers,
            returns,
            updatedAt,
            deletedAt,
        );
        return inventory;
    }
}