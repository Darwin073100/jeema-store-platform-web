import { useEffect, useState } from "react";
import { useSaleInventoryListStore } from "../infraestructure/stores/sale.inventory-list.store";
import { findAllInventoryItemsByLocationAndBranchOfficeAction } from "@/features/inventory/actions/find-all-inventory-items-by-location-and-branch-office.action";
import { useWorkspace } from "@/shared/hooks/useAuth";
import { InventoryItemEntity } from "@/features/inventory/domain/entities/inventory-item.entity";
import { FloatMessageType } from "@/shared/ui/types/FloatMessageType";
import { useSaleStore } from "../infraestructure/stores/sale.store";
import { CreateSaleAndAddDetailAction } from "../actions/create-sale-and-add-detail.action";
import { RegisterSaleDto } from "../application/dtos/register-sale.dto";
import { AddDetailToSaleDto } from "../application/dtos/add-detail-to-sale.dto";

const useInventoryListModal = () => {
    const { inventoryItems, setInventoryItems, modalInventoryList, itemSelected, setItemSelected, filterInventoryItems, 
        setFilterInventoryItems,
    } = useSaleInventoryListStore();
    const { saleId, setSale, setSaleId } = useSaleStore();
    const { branchOffice, employee } = useWorkspace();
    const [quantityInsert, setQuantityInsert] = useState<number>(0);
    const [ isLoading, setIsLoading] = useState<boolean>(false);
    const [floatMessageState, setFloatMessageState] = useState<FloatMessageType>({});


    useEffect(()=>{
        hanldeFindInventoryItems();
    },[]);

    useEffect(()=>{
        setQuantityInsert(0);
    }, [itemSelected]);
    
    useEffect(()=>{
        setQuantityInsert(0);
        setItemSelected(null);
    }, [modalInventoryList]);
    


    const handleAddDetail = async()=> {
        const registerSaleDTO: RegisterSaleDto = {
            branchOfficeId: BigInt(branchOffice?.branchOfficeId ?? 0),
            employeeId: BigInt(employee?.employeeId ?? 0),
            customerId: BigInt(2)
        }

        let addDetailToSaleDTO: AddDetailToSaleDto;
        addDetailToSaleDTO = {
            productBarCodeAtSale: itemSelected?.inventory?.internalBarCode ?? '',
            productUnitAtSale: itemSelected?.inventory?.product?.unitOfMeasure ?? '',
            quantity: quantityInsert,
            unitPriceAtSale: itemSelected?.inventory?.salePriceOne ?? 0
        }
        setIsLoading(true);
        const result = await CreateSaleAndAddDetailAction(saleId, registerSaleDTO, addDetailToSaleDTO);
        if(!result.ok ){
            setFloatMessageState({
                type: 'red',
                summary: '¡Hay un error!',
                description: result.error?.message ?? 'Ha ocurrido un error al agregar el producto a la venta.',
                isActive: true,
            });
        } else {
            // Validar que venga un value para actualizar la venta
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
        }
        setIsLoading(false);
        setTimeout(()=>{
            setFloatMessageState({});
        },3000);
    }

    
    const hanldeFindInventoryItems = async ()=>{
        const branchOfficeId = branchOffice ? BigInt(branchOffice.branchOfficeId): BigInt(0);
        const result = await findAllInventoryItemsByLocationAndBranchOfficeAction(branchOfficeId);
        if(result.ok && result.value){
            setInventoryItems(result.value.items);
        }
    }

    const handleSetItemSelected = (item: InventoryItemEntity | null)=> {
        setItemSelected(item);
    }

    return {
        handleSetItemSelected,
        quantityInsert,
        setQuantityInsert,
        handleAddDetail,
        isLoading,
        floatMessageState,
    }
}

export { useInventoryListModal };
