import { InventoryCheckerPort } from "src/contexts/inventory-management/inventory/domain/port/out/inventory-ckecker.port";
import { DataSource, Repository } from "typeorm";
import { InventoryOrmEntity } from "../entities/inventory.orm-entity";
import { Injectable } from "@nestjs/common";
import { StockNotAvailableException } from "../../../../domain/exceptions/stock-not-available.exception";
import { InventoryItemOrmEntity } from "src/contexts/inventory-management/inventory-item/infraestructure/persistence/typeorm/entities/inventory-item.orm-entity";
import { LocationEnum } from "src/contexts/inventory-management/inventory-item/domain/enums/location.enum";

@Injectable()
export class InventoryCheckerAdapter implements InventoryCheckerPort{
    private readonly repository: Repository<InventoryOrmEntity>;

    constructor(
        private readonly datasource: DataSource
    ){
        this.repository = this.datasource.getRepository(InventoryOrmEntity); 
    }
    async exist(id: bigint): Promise<boolean> {
        const result = await this.repository.existsBy({inventoryId: id});
        return result;
    }

    async hasStock(id: bigint, quantity: number): Promise<boolean> {
        // Buscar el inventario con sus items
        const inventory = await this.repository.findOne({
            where: { inventoryId: id },
            relations: ['inventoryItems']
        });

        if (!inventory || !inventory.inventoryItems) {
            throw new Error(`Inventario con ID ${id} no encontrado`);
        }

        // Buscar stock en ubicación de ventas
        const salesItem = inventory.inventoryItems.find(
            item => item.location === LocationEnum.SALE
        );

        if (salesItem && salesItem.quantityOnHand >= quantity) {
            return true;
        }

        // Si no hay suficiente stock en ventas, buscar en otras ubicaciones (principalmente almacén)
        const otherLocations = inventory.inventoryItems.filter(
            item => item.location === LocationEnum.STOCK && item.quantityOnHand >= quantity
        );

        if (otherLocations.length > 0) {
            // Encontró stock en otra ubicación
            const bestLocation = otherLocations.reduce((prev, curr) => 
                prev.quantityOnHand > curr.quantityOnHand ? prev : curr
            );

            throw new StockNotAvailableException(
                id,
                quantity,
                bestLocation.location,
                bestLocation.quantityOnHand
            );
        }

        // No hay stock suficiente en ninguna ubicación
        const totalStock = (inventory.inventoryItems as InventoryItemOrmEntity[]).reduce(
            (sum: number, item: InventoryItemOrmEntity) => sum + Number(item.quantityOnHand), 
            0
        );

        throw new StockNotAvailableException(
            id,
            quantity,
            undefined,
            totalStock
        );
    }
}