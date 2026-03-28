import { SaleDetailRepository } from "../../domain/repositories/sale-detail.repository";
import { AddDetailToSaleDto } from "../dtos/add-detail-to-sale.dto";
import { InventoryRepository } from "src/contexts/inventory-management/inventory/domain/repositories/inventory.repository";
import { SaleNotFoundException } from "src/contexts/sale-management/sale/domain/exceptions/sale-not-found.exception";
import { LocationEnum } from "src/contexts/inventory-management/inventory-item/domain/enums/location.enum";
import { SaleDetailEntity } from "../../domain/entities/sale-detail.entity";
import { InventoryInsufficientStockException } from "../../domain/exceptions/inventory-insufficient-stock.exception";
import { SaleForEnum } from "../../domain/enums/sale-for.enum";
import { SaleRepository } from "@/contexts/sale-management/sale/domain/repositories/sale.repository";

export class RegisterSaleDetailUseCase{
    constructor(
        private readonly saleDetailRepository: SaleDetailRepository,
        private readonly saleRepository: SaleRepository,
        private readonly inventoryRepository: InventoryRepository
    ){}

    // TODO: Cuando encuentre un registro ya existente, debe hacer algo para que recalcule sin inconsistencias el inventario de ventas.
    async execute(command: AddDetailToSaleDto){
        //* Verificar que la venta a la que se va signar exista
        const isSale = await this.saleRepository.existById(command.saleId);
        if(!isSale) throw new SaleNotFoundException('La venta a la que se va asignar el detalle no existe.');
        
        //! Verificar si hay un registro con el id de la venta y el codigo de barra
        const saleDetailExist = await this.saleDetailRepository.findByBarCode(command.saleId, command.productBarCodeAtSale);
        
        //* Available inventory, inventario disponible
        const inventory = await this.inventoryRepository.findByInternalBarCode(command.productBarCodeAtSale);
        if(!inventory) throw new SaleNotFoundException(`Producto con código ${command.productBarCodeAtSale} no encontrado`);

        const product = inventory.product;
        if(!product) throw new SaleNotFoundException(`Producto con código ${command.productBarCodeAtSale} no encontrado`);

        //* Como no se repiten los stock siempre sera la primera posicion[0]
        const locationSale = inventory.inventoryItems?.filter(item=> item.location === LocationEnum.SALE)[0];
        //* Como no se repiten los stock siempre sera la primera posicion[0]
        const locationStock = inventory.inventoryItems?.filter(item=> item.location === LocationEnum.STOCK)[0];
        
        let quantitySale = Number(locationSale?.quantityOnHand.value) ?? 0;
        let quantityStock = Number(locationStock?.quantityOnHand.value) ?? 0;
        
        if(saleDetailExist){
            if((quantitySale - command.quantity) < 0){
                throw new InventoryInsufficientStockException('No tienes suficiente stock para la venta.');
            } else if(((quantitySale - command.quantity) >= 0)) {
                let finalPrice : number = 0;
                if(command.saleFor === SaleForEnum.ONE ){
                    finalPrice = Number(inventory.salePriceOne?.value ?? 0);
                } else if(command.saleFor === SaleForEnum.MANY ){
                    finalPrice = Number(inventory.salePriceMany?.value ?? 0);
                } else {
                    finalPrice = Number(command.specialPrice ?? 0);
                }
                const quantity = Number(command.quantity.toFixed(3))
                const unitPriceAtSale = Number((finalPrice ?? 0).toFixed(2)); //? Falta aplicar descuentos
                const regularPriceAtSale = Number((inventory.salePriceOne?.value ?? 0).toFixed(2));
                const subTotal = Number((quantity * unitPriceAtSale).toFixed(2));

                const priceOnetTotal = Number(inventory.salePriceOne?.value ?? 0) * quantity;
                const priceFinalTotal = finalPrice * quantity;

                const discountTotal = priceOnetTotal - priceFinalTotal;
                
                saleDetailExist.updateQuantity(quantity);
                saleDetailExist.updateUnitPriceAtSale(unitPriceAtSale);
                saleDetailExist.updateRegularPriceAtSale(regularPriceAtSale);
                saleDetailExist.updateSaleDetailSubTotal(subTotal);
                saleDetailExist.updateSaleDetailDiscount(discountTotal);
                saleDetailExist.updateSaleFor(command.saleFor);
                saleDetailExist.updateProductUnitAtSale(command.productUnitAtSale);
                saleDetailExist.updateNotes(command.notes ?? null);
                return await this.saleDetailRepository.save(saleDetailExist);
            }
        }

        let saleDetail: SaleDetailEntity;
        if(quantitySale > 0){
            if(((quantitySale - command.quantity) < 0)){
                throw new InventoryInsufficientStockException('No tienes suficiente stock para la venta.');
            } else if(((quantitySale - command.quantity) >= 0)){
                let finalPrice: number = 0;
                if(command.saleFor === SaleForEnum.ONE ){
                    finalPrice = Number(inventory.salePriceOne?.value ?? 0);
                } else if(command.saleFor === SaleForEnum.MANY ){
                    finalPrice = Number(inventory.salePriceMany?.value ?? 0);
                } else {
                    finalPrice = Number(command.specialPrice ?? 0);
                }
                const quantity = Number(command.quantity.toFixed(3))
                const unitPriceAtSale = Number((finalPrice).toFixed(2));
                const regularPriceAtSale = Number((inventory.salePriceOne?.value ?? 0).toFixed(2));
                const subTotal = Number((quantity * unitPriceAtSale).toFixed(2));

                const priceOnetTotal = Number(inventory.salePriceOne?.value ?? 0) * quantity;
                const priceFinalTotal = finalPrice * quantity;

                const discountTotal = priceOnetTotal - priceFinalTotal;

                saleDetail = SaleDetailEntity.create(
                    command.saleId,
                    product.productId,
                    inventory.inventoryId,
                    product.name.value,
                    command.productBarCodeAtSale,
                    command.productUnitAtSale,
                    quantity,
                    unitPriceAtSale,
                    regularPriceAtSale,
                    subTotal,
                    discountTotal,
                    command.saleFor,
                    product.description.value,
                    product.brand?.name ?? null,
                    product.category?.name ?? null,
                    command.notes ?? null
                );
                return await this.saleDetailRepository.save(saleDetail);
            }
        } else {
            if(quantityStock >= command.quantity){
                throw new InventoryInsufficientStockException('Reabastece tu area de ventas con tu almacen.');
            }
            throw new InventoryInsufficientStockException('No hay stock disponible.');
        }
    }
}