'use client';
import { findInventoryByBarCodeAction } from "@/features/inventory/actions/find-inventory-by-bar-code.action";
import { InventoryEntity } from "@/features/inventory/domain/entities/inventory.entity";
import { useWorkspace } from "@/shared/hooks/useAuth";
import { FloatMessageType } from "@/shared/ui/types/FloatMessageType";
import { useEffect, useRef, useState } from "react";
import { useSaleStore } from "../infraestructure/stores/sale.store";
import { registerSaleInitialAction } from "../actions/register-sale-initial.action";
import { findSaleWithDetailAction } from "../actions/find-sale-by-id-with-detail.action";
import { AddDetailToSaleDto } from "../application/dtos/add-detail-to-sale.dto";
import { addDetailToSaleAction } from "../actions/add-detail-to-sale.action";

const useSale = () => {
    const [inventory, setInventory] = useState<InventoryEntity>();
    const [floatMessageState, setFloatMessageState] = useState<FloatMessageType>({});
    const [searchValue, setSearchValue] = useState<string>('');
    const { branchOffice, employee } = useWorkspace();
    const { resetSale, sale, setSale, saleId, resetSaleId, setSaleId } = useSaleStore();
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const inputRef = useRef<HTMLInputElement>(null);
    useEffect(() => {
        // Función que mantiene el foco en el input
        const maintainFocus = (e?: Event) => {
            // Permitir interacción normal con botones y otros inputs
            if (e?.target instanceof HTMLElement) {
                const tagName = e.target.tagName.toLowerCase();
                if (tagName === 'button' || (tagName === 'input' && e.target !== inputRef.current)) {
                    return;
                }
            }

            // Asegurar que el foco vuelva al input principal
            if (document.activeElement !== inputRef.current) {
                inputRef.current?.focus();
            }
        };

        // Aplicar foco inicial
        maintainFocus();

        // Event listeners para mantener el foco
        document.addEventListener('mousedown', maintainFocus);
        document.addEventListener('mouseup', maintainFocus);
        window.addEventListener('focus', maintainFocus);

        // Cleanup al desmontar
        return () => {
            document.removeEventListener('mousedown', maintainFocus);
            document.removeEventListener('mouseup', maintainFocus);
            window.removeEventListener('focus', maintainFocus);
        };
    }, []);

    const handleSearchInventory = async (barCode: string) => {
        try {
            setIsLoading(true);
            const result = await findInventoryByBarCodeAction(barCode);
            if (!result.ok) {
                console.log(result.error);
                setFloatMessageState({
                    summary: '¡Error!',
                    description: result.error?.message,
                    type: 'red',
                    isActive: true
                });

                handleResetSearch();
                setTimeout(() => {
                    setFloatMessageState({});
                }, 4000);
            } else {
                setInventory(result.value);
                if( !sale ){
                    const branchOfficeId = branchOffice?.branchOfficeId? BigInt(branchOffice.branchOfficeId): BigInt(0);
                    const employeeId = employee?.employeeId ? BigInt(employee.employeeId) :BigInt(0);
                    const createSaleResult = await registerSaleInitialAction({
                        branchOfficeId,
                        employeeId,
                        customerId: BigInt(2)
                    });
    
                    if(createSaleResult?.ok){
                        setSaleId(createSaleResult.value?.saleId ?? BigInt(0));
                    }
                }

                await handleUpdateSaleDetails(saleId);
                handleResetSearch();
                console.log(inventory);
            }

        } catch (error) {

        }
    }

    const handleUpdateSaleDetails = async (saleId: bigint)=>{
        try {
            const result = await findSaleWithDetailAction(saleId);
            if(result?.ok){
                setSale(result.value ?? null);
            }
        } catch (error: any) {
            setFloatMessageState({
                    summary: '¡Error!',
                    description: error.message,
                    type: 'red',
                    isActive: true
                });

                setTimeout(() => {
                    setFloatMessageState({});
                }, 4000);
        }
    }

    const handleAddDetailToSale = async (saleId: bigint, dto: AddDetailToSaleDto)=> {
        try{
            const addResult = await addDetailToSaleAction(saleId, dto);
            if(addResult?.ok){
                await handleUpdateSaleDetails(saleId);
            }
        } catch(error){
        
        }

    }





    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        handleSearchInventory(searchValue);
    }
    const handleChangeSearch = (e: React.FormEvent<HTMLInputElement>) => {
        setSearchValue(e.currentTarget.value);
    }

    const handleResetSearch = ()=> {
        setIsLoading(false);
        setSearchValue('');
    }


    return {
        handleChangeSearch,
        searchValue,
        handleSubmit,
        floatMessageState,
        inputRef,
        isLoading,
    }
}

export { useSale }
