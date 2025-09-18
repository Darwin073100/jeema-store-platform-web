'use client';
import { findInventoryByBarCodeAction } from "@/features/inventory/actions/find-inventory-by-bar-code.action";
import { InventoryEntity } from "@/features/inventory/domain/entities/inventory.entity";
import { FloatMessageType } from "@/shared/ui/types/FloatMessageType";
import { useEffect, useRef, useState } from "react";

const useSearchInventory = () => {
    const [inventory, setInventory] = useState<InventoryEntity>();
    const [floatMessageState, setFloatMessageState] = useState<FloatMessageType>({});
    const [searchValue, setSearchValue] = useState<string>('');

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
            }
            setInventory(result.value);
            handleResetSearch();
            console.log(inventory);
        } catch (error) {

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
        setSearchValue('');
    }


    return {
        handleChangeSearch,
        searchValue,
        handleSubmit,
        floatMessageState,
        inputRef,
    }
}

export { useSearchInventory }
