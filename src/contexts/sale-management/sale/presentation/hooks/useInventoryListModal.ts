import { useEffect, useState } from "react";
import { useSaleStore } from "../stores/sale.store";
import { useSaleUIStore } from "../stores/sale.ui.store";
import { useSaleProcessStore } from "../stores/sale.process.store";
import { useSale } from "./useSale";
import { IInventory } from "@/contexts/inventory-management/inventory/presentation/interfaces/IInventory";
import { IInventoryItem } from "@/contexts/inventory-management/inventory-item/presentation/interfaces/IInventoryItem";
import { CreateSaleAndAddDetailAction } from "../actions/create-sale-and-add-detail.action";
import { ISale } from "../interfaces/ISale";
import { findAllInventoryItemsByLocationAndBranchOfficeAction } from "@/contexts/inventory-management/inventory-item/presentation/actions/find-all-inventory-items-by-location-and-branch-office.action";
import { LocationEnum } from "@/contexts/inventory-management/inventory-item/domain/enums/location.enum";

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
        setFilterInventoryItems([]);
        setSearchProductValue('');
    }, [saleModals]);

    useEffect(() => {
        setQuantityInsert(1);
    }, [itemSelected]);

    useEffect(() => {
        setQuantityInsert(1);
        setItemSelected(null);
    }, [saleModals]);

    const handleVerifyExistDetail = (sale: ISale, inventory?: IInventory, )=>{
        const existingProduct = sale?.saleDetails?.find(
                detail => detail.productBarCodeAtSale === (inventory?.internalBarCode || '') 
                    || detail.productBarCodeAtSale === (inventory?.product?.universalBarCode || '') 
        );
        return existingProduct;
    }

    const onSubmit = async(e:React.SubmitEvent<HTMLFormElement>)=> {
        e.preventDefault();
        const result = await findAllInventoryItemsByLocationAndBranchOfficeAction(
            {product:searchProductValue}, 
            LocationEnum.SALE
        );
        setFilterInventoryItems(result?.value?.items ?? []);
    }

    const quantitySubmit = async(e:React.SubmitEvent<HTMLFormElement>)=> {
        e.preventDefault();
        await handleAddDetail();
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
                customers.length >0? BigInt(customers.filter(item=> item.saleDefault===true)[0].customerId ?? 0): BigInt(0), 
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
                }, 3000);
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

    const handleSetItemSelected = (item: IInventoryItem | null) => {
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
        itemSelected,
        onSubmit,
        quantitySubmit,
    }
}

export { useInventoryListModal };
