import { useEffect, useState } from "react";
import { InventoryItemEntity } from "@/features/inventory/domain/entities/inventory-item.entity";
import { useSaleStore } from "../infraestructure/stores/sale.store";
import { CreateSaleAndAddDetailAction } from "../actions/create-sale-and-add-detail.action";
import { useSaleUIStore } from "../infraestructure/stores/sale.ui.store";
import { useSaleProcessStore } from "../infraestructure/stores/sale.process.store";
import { useSale } from "./useSale";
import { SaleEntity } from "../domain/entities/sale-entity";
import { InventoryEntity } from "@/features/inventory/domain/entities/inventory.entity";

const useInventoryListModal = () => {
    const { inventoryItems, itemSelected, setItemSelected,
        setFilterInventoryItems, filterInventoryItems, customers
    } = useSaleProcessStore();
    const { saleId, setSale, setSaleId, sale, cashSessionActive } = useSaleStore();
    const { hancleCalculateDetailPrice } = useSale();
    const [quantityInsert, setQuantityInsert] = useState<number>(0);
    const [searchProductValue, setSearchProductValue] = useState<string>('')
    // LOADING: addProductToSaleLoading
    const {
        setFloatMessageState, saleModals, closeSaleModal, openSaleModal, loading, initLoading, finishLoading
    } = useSaleUIStore();


    useEffect(() => {
        setFilterInventoryItems(inventoryItems);
    }, [saleModals]);

    useEffect(() => {
        setQuantityInsert(0);
    }, [itemSelected]);

    useEffect(() => {
        setQuantityInsert(0);
        setItemSelected(null);
    }, [saleModals]);

    useEffect(() => {
        const regex = new RegExp(searchProductValue, 'i');
        const newInventoryFilter = inventoryItems.filter(item => regex.test(item.inventory?.product?.name ?? ''));
        setFilterInventoryItems(newInventoryFilter);
    }, [searchProductValue]);

    const handleVerifyExistDetail = (sale: SaleEntity, inventory?: InventoryEntity, )=>{
        const existingProduct = sale?.saleDetails?.find(
                detail => detail.productBarCodeAtSale === (inventory?.internalBarCode || '') 
                    || detail.productBarCodeAtSale === (inventory?.product?.universalBarCode || '') 
        );
        return existingProduct;
    }

    const handleAddDetail = async () => {
        if(!cashSessionActive){
            setFloatMessageState({
                summary: '404: ¡Error! 😢',
                description: 'Debes aperturar caja para poder vender',
                type: 'red',
                isActive: true
            });
            setTimeout(() => {
                setFloatMessageState({});
            }, 4000);
            return;
        }
        const inventorySelected = itemSelected?.inventory;
        if (inventorySelected) {
            if(sale){
                if(handleVerifyExistDetail(sale, inventorySelected)){
                    setFloatMessageState({
                        type: 'red',
                        summary: '400: ¡Hay un error o conflicto!',
                        description: 'Este producto ya está en la venta, modifica la cantidad en su registro.',
                        isActive: true,
                    });
                    setTimeout(() => {
                        setFloatMessageState({});
                    }, 4000);
                    return;
                }
            }
            const addDetailToSaleDTO = hancleCalculateDetailPrice(inventorySelected, quantityInsert);
            initLoading('addDetailToSaleLoading');
            const result = await CreateSaleAndAddDetailAction(
                saleId, BigInt(customers.filter(item=> item.saleDefault===true)[0].customerId ?? 0), 
                cashSessionActive.cashRegisterId, 
                addDetailToSaleDTO);
            if (!result.ok) {
                setFloatMessageState({
                    type: 'red',
                    summary: '¡Hay un error!',
                    description: result.error?.message ?? 'Ha ocurrido un error al agregar el producto a la venta.',
                    isActive: true,
                });
                setTimeout(() => {
                    setFloatMessageState({});
                }, 2000);
            } else {
                // Validar que venga un value para actualizar el estado de la venta.
                result.value ?
                    setSale(result.value) : null;
                result.value ?
                    setSaleId(result.value.saleId) : null;

                setFloatMessageState({
                    type: 'green',
                    summary: '¡Correcto!',
                    description: 'Se ha agregado el producto a la venta',
                    isActive: true
                });
                closeSaleModal();
                setTimeout(() => {
                    setFloatMessageState({});
                }, 2000);
            }
            finishLoading();
        } else {
            setFloatMessageState({
                type: 'red',
                summary: '¡Hay un error!',
                description: 'Ha ocurrido un error al agregar el producto a la venta.',
                isActive: true,
            });
            setTimeout(() => {
                setFloatMessageState({});
            }, 2000);
        }
    }

    const handleSetItemSelected = (item: InventoryItemEntity | null) => {
        setItemSelected(item);
    }

    return {
        loading,
        handleSetItemSelected,
        quantityInsert,
        setQuantityInsert,
        handleAddDetail,
        searchProductValue,
        setSearchProductValue,
        closeSaleModal,
        openSaleModal,
        saleModals,
        filterInventoryItems,
        itemSelected
    }
}

export { useInventoryListModal };
