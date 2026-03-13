import { ConnectionDBRepository } from "src/config/database/typeorm/connection/domain/repositories/connection-repository";
import { ReturnsRepository } from "../../domain/repositories/returns.repository";
import { ReturnsProductsDTO } from "../dtos/returns-products.dto";
import { EmployeeRepository } from "src/contexts/employee-management/employee/domain/repositories/employee.repository";
import { InventoryRepository } from "src/contexts/inventory-management/inventory/domain/repositories/inventory.repository";
import { SaleDetailRepository } from "src/contexts/sale-management/sale-detail/domain/repositories/sale-detail.repository";
import { ReturnsEntity } from "../../domain/entities/returns.entity";
import { InventoryItemRepository } from "src/contexts/inventory-management/inventory-item/domain/repositories/inventory-item.repository";
import { LocationEnum } from "src/contexts/inventory-management/inventory-item/domain/enums/location.enum";
import { InventoryItemEntity } from "src/contexts/inventory-management/inventory-item/domain/entities/inventory-item.entity";
import { InventoryItemQuantityOnHandVO } from "src/contexts/inventory-management/inventory-item/domain/value-objects/inventory-item-quantity-on-hand.vo";
import { TransactionRepository } from "src/contexts/transaction-management/transaction/domain/repositories/transaction.repository";
import { TransactionEntity } from "src/contexts/transaction-management/transaction/domain/entities/transaction.entity";

export class ReturnsProductsUseCase {
    constructor(
        private readonly returnsRepo: ReturnsRepository,
        private readonly employeeRepo: EmployeeRepository,
        private readonly inventoryRepo: InventoryRepository,
        private readonly inventoryItemRepo: InventoryItemRepository,
        private readonly saleDetailRepo: SaleDetailRepository,
        private readonly transactionRepo: TransactionRepository,
        private readonly connection: ConnectionDBRepository,
    ) { }

    async execute(command: ReturnsProductsDTO) {
        try {
            await this.connection.beginTransaction();
            const employeeExist = await this.employeeRepo.existById(command.employeeId);
            if (!employeeExist) {
                throw new Error('Empleado no encontrado.');
            }
            const returns: ReturnsEntity[] = [];

            // Validar que los datalles para devolución sean de la venta.
            for (let i = 0; i < command.products.length; i++) {
                const product = command.products[i];
                const saleDetailExist = await this.saleDetailRepo.findById(product.saleDetailId);
                if (!saleDetailExist) {
                    throw new Error('Detalle de venta no encontrado.');
                }
                if(saleDetailExist.saleId!==command.saleId){
                    throw new Error(`El detalle de venta ${saleDetailExist.productNameAtSale} con folio ${saleDetailExist.saleDetailId} no se encontró en la venta actual.`);
                }

                const returnsValidate = await this.returnsRepo.findAllBySaleDetailId(saleDetailExist.saleDetailId);
                let totalAmountReturns = 0;
                returnsValidate.forEach(item => totalAmountReturns=totalAmountReturns+item.amountReturn);  
                let totalQuantityReturns = 0;
                returnsValidate.forEach(item => totalQuantityReturns=totalQuantityReturns+item.quantityReturn);  

                // Sumamos la cantidad del producto a retornar con lo que hay.
                let currentTotalAmountReturns = totalAmountReturns + product.amountReturn; 
                let currentTotalQuantityReturns = totalQuantityReturns + product.quantityReturn; 

                if(currentTotalAmountReturns> saleDetailExist.subtotalItem){
                    throw new Error('No puedes devolver mas dinero de lo que el cliente dió por la mercancía.');
                }
                if(currentTotalQuantityReturns> saleDetailExist.quantity){
                    throw new Error('No puedes recibir mas producto de lo que el cliente se llevó.');
                }
                const inventoryExist = await this.inventoryRepo.existById(product.inventoryId);
                if (!inventoryExist) {
                    throw new Error('El inventario del producto no fue encontrado.');
                }
            }

            for (let i = 0; i < command.products.length; i++) {
                const product = command.products[i];
                // Actualizacion del inventario, enviando el producto retornado a dañado.
                let inventoryItemExist = await this.inventoryItemRepo.findByLocation(product.inventoryId, LocationEnum.DAMAGED);
                // Si hay un stock dañado, añade la cantidad devuelta, en caso contrario apertura el stock dañado con la cantidad
                // de producto devuelto.
                if (!inventoryItemExist) {
                    const newInventoryItem = InventoryItemEntity.create(
                        product.inventoryId, LocationEnum.DAMAGED, InventoryItemQuantityOnHandVO.create(product.quantityReturn));
                        await this.inventoryItemRepo.save(newInventoryItem);
                } else {
                    const stockDamageQuantity = inventoryItemExist.quantityOnHand.value;
                    const stockActual = stockDamageQuantity + product.quantityReturn;
                    inventoryItemExist.updateQuantityOnHand(stockActual);
                    await this.inventoryItemRepo.update(inventoryItemExist);
                }
                // Creación del objeto
                const item = ReturnsEntity.create(
                    product.saleDetailId,
                    command.employeeId,
                    product.inventoryId,
                    product.quantityReturn,
                    product.amountReturn,
                    product.notes
                );
                // Agregamos el objeto al array de devoluciones.
                returns.push(item);
            }
            if(command.products.length===0){
                throw new Error('El debes de hacer la devolución de  al menos un producto de la venta.');
            }
            let totalAmountReturn = 0;
            command.products.forEach(item => totalAmountReturn = totalAmountReturn + item.amountReturn);
            const transaction = TransactionEntity.create(
                BigInt(11),
                command.branchOfficeId,
                null,
                command.saleId,
                command.employeeId,
                command.cashSessionId,
                totalAmountReturn,
                'Devolución de mercancía');
            await this.transactionRepo.save(transaction);
            const result = this.returnsRepo.saveAll(returns);
            await this.connection.commit();
            return result;
        } catch (error) {
            await this.connection.rollback();
            throw error;
        }
    }
}