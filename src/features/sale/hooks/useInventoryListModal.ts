import { useEffect, useState } from "react";
import { findAllInventoryItemsByLocationAndBranchOfficeAction } from "@/features/inventory/actions/find-all-inventory-items-by-location-and-branch-office.action";
import { useWorkspace } from "@/shared/hooks/useAuth";
import { InventoryItemEntity } from "@/features/inventory/domain/entities/inventory-item.entity";
import { useSaleStore } from "../infraestructure/stores/sale.store";
import { CreateSaleAndAddDetailAction } from "../actions/create-sale-and-add-detail.action";
import { RegisterSaleDto } from "../application/dtos/register-sale.dto";
import { AddDetailToSaleDto } from "../application/dtos/add-detail-to-sale.dto";
import { useSaleUIStore } from "../infraestructure/stores/sale.ui.store";
import { useSaleProcessStore } from "../infraestructure/stores/sale.process.store";

const useInventoryListModal = () => {
    const { inventoryItems, setInventoryItems, itemSelected, setItemSelected, 
        setFilterInventoryItems, filterInventoryItems
    } = useSaleProcessStore();
    const { saleId, setSale, setSaleId } = useSaleStore();
    const { branchOffice, employee } = useWorkspace();
    const [quantityInsert, setQuantityInsert] = useState<number>(0);
    const [searchProductValue, setSearchProductValue] = useState<string>('')
    // LOADING: addProductToSaleLoading
    const { 
        setFloatMessageState, saleModals, closeSaleModal, openSaleModal, loading, initLoading, finishLoading
    } = useSaleUIStore();


    useEffect(()=>{
        setFilterInventoryItems(inventoryItems);
    },[saleModals]);

    useEffect(()=>{
        setQuantityInsert(0);
    }, [itemSelected]);
    
    useEffect(()=>{
        setQuantityInsert(0);
        setItemSelected(null);
    }, [saleModals]);

    useEffect(()=>{
        const regex = new RegExp(searchProductValue, 'i');
        const newInventoryFilter = inventoryItems.filter( item => regex.test(item.inventory?.product?.name ?? ''));
        setFilterInventoryItems(newInventoryFilter);
    }, [searchProductValue]);
    


    const handleAddDetail = async()=> {
        const registerSaleDTO: RegisterSaleDto = {
            branchOfficeId: BigInt(branchOffice?.branchOfficeId ?? 0),
            employeeId: BigInt(employee?.employeeId ?? 0),
            customerId: BigInt(2)
        }

        const addDetailToSaleDTO: AddDetailToSaleDto = {
            productBarCodeAtSale: itemSelected?.inventory?.internalBarCode ?? '',
            productUnitAtSale: itemSelected?.inventory?.product?.unitOfMeasure ?? '',
            quantity: quantityInsert,
            unitPriceAtSale: itemSelected?.inventory?.salePriceOne ?? 0
        }

        initLoading('addDetailToSaleLoading');
        const result = await CreateSaleAndAddDetailAction(saleId, registerSaleDTO, addDetailToSaleDTO);
        console.log(result);
        if(!result.ok ){
            setFloatMessageState({
                type: 'red',
                summary: '¡Hay un error!',
                description: result.error?.message ?? 'Ha ocurrido un error al agregar el producto a la venta.',
                isActive: true,
            });
            setTimeout(()=>{
                setFloatMessageState({});
            },2000);
        } else {
            // Validar que venga un value para actualizar el estado de la venta.
            result.value?
            setSale(result.value): null;
            result.value?
            setSaleId(result.value.saleId): null;

            setFloatMessageState({
                type: 'green',
                summary: '¡Correcto!',
                description: 'Se ha agregado el producto a la venta',
                isActive: true
            });
            closeSaleModal();
            setFloatMessageState({});
        }
        finishLoading();
    }

    const handleSetItemSelected = (item: InventoryItemEntity | null)=> {
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
