import { InventoryItemInternalBarCodeVO } from "../value-objects/inventory-item-internal-bar-code.vo";
import { InventoryItemPurchasePriceAtStockVO } from "../value-objects/inventory-item-purchase-price-at-stock.vo";
import { LocationEnum } from "../enums/location.enum";
import { InventoryItemQuantityOnHandVO } from "../value-objects/inventory-item-quantity-on-hand.vo";
import { InventoryEntity } from "src/contexts/inventory-management/inventory/domain/entities/inventory.entity";

export class InventoryItemEntity{
    private readonly _inventoryItemId : bigint;
    private _inventoryId              : bigint;
    private _location                 : LocationEnum;
    private _quantityOnHand           : InventoryItemQuantityOnHandVO;
    private readonly _createdAt       : Date;
    private _inventory?               : InventoryEntity | null;
    private _updatedAt?               : Date | null;
    private _deletedAt?               : Date | null;

    constructor(
        inventoryItemId      : bigint,
        inventoryId            : bigint,
        location             : LocationEnum,
        quantityOnHan        : InventoryItemQuantityOnHandVO,
        createdAt            : Date,
        inventory?           : InventoryEntity | null,
        updatedAt?           : Date | null,
        deletedAt?           : Date | null,
    ){

        this._inventoryItemId      = inventoryItemId;
        this._inventoryId          = inventoryId;
        this._location             = location;
        this._quantityOnHand        = quantityOnHan;
        this._createdAt            = createdAt;
        this._inventory            = inventory;
        this._updatedAt            = updatedAt;
        this._deletedAt            = deletedAt;

    }
    get inventoryItemId(){
        return this._inventoryItemId;
    }
    get inventoryId(){
        return this._inventoryId;
    }
    get location(){
        return this._location;
    }
    get quantityOnHand(){
        return this._quantityOnHand;
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
    get inventory(){
        return this._inventory;
    }


    static create(
        inventoryId          : bigint,
        location             : LocationEnum,
        quantityOnHan        : InventoryItemQuantityOnHandVO,
    ){
        const inventory = new InventoryItemEntity(
            BigInt(0),
            inventoryId,
            location,
            quantityOnHan,
            new Date(),
            null,
            null,
            null,
        );
        return inventory; 
    }

    static reconstitute(
        inventoryItemId      : bigint,
        inventoryId            : bigint,
        location             : LocationEnum,
        quantityOnHan        : InventoryItemQuantityOnHandVO,
        createdAt            : Date,
        inventory?: InventoryEntity|null, 
        updatedAt?           : Date | null,
        deletedAt?           : Date | null,
    ){
        const inventoryEntity = new InventoryItemEntity(
            inventoryItemId,
            inventoryId,
            location,
            quantityOnHan,
            createdAt,
            inventory,
            updatedAt,
            deletedAt,
        );
        return inventoryEntity;
    }

    public updateLocation(location: LocationEnum){
        this._location = location;
    }
    public updateQuantityOnHand(quantity: number){
        return this._quantityOnHand = InventoryItemQuantityOnHandVO.create(quantity);
    }

}