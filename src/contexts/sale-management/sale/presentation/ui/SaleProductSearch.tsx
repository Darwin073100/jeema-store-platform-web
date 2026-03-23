'use client'
import React, { useEffect } from "react";
import { Button } from "@/shared/ui/components/buttons";
import { TextInput } from "@/shared/ui/components/inputs";
import { IoIosBarcode, IoMdCheckmark } from "react-icons/io";
import { useSale } from "../hooks/useSale";
import { Spinner } from "@/shared/ui/components/loadings/Spinner";
import { CashSessionEntity } from "@/features/cash/domain/entities/cash-session.entity";
import { useSaleStore } from "../stores/sale.store";
interface Props {
    cashSession: CashSessionEntity | null;
}
const SaleProductSearch = ({ cashSession }: Props) => {
    const { handleSubmit, inputRef, handleChangeSearch, searchValue, loading } = useSale();
    const { setCashSessionActive } = useSaleStore();

    useEffect(()=> {
        setCashSessionActive(cashSession);
    },[cashSession]);

    return (
        <form  
            onSubmit={handleSubmit}
            className="flex gap-4 items-center w-full justify-between">
            <section className="flex bg-gradient-to-r from-blue-600 to-blue-700 w-full items-center rounded-xl shadow-md gap-4 pl-4">
                {loading === 'findInventoryItemsLoading'? <Spinner /> :<IoIosBarcode className="text-white text-2xl" />}
                <TextInput
                    ref={inputRef}
                    autoFocus
                    value={searchValue}
                    onChange={handleChangeSearch}
                    placeholder="Escanea o escribe el código de barras" />
            </section>
            <section className="flex w-1/3">
                <Button className="w-full justify-center shadow-md hover:shadow-lg transition-all">
                    <IoMdCheckmark className="text-xl max-sm:hidden" />
                    <span className="flex-1 max-md:hidden">Agregar producto</span>
                    <span className="text-xs bg-white/20 px-2 py-1 rounded">ENTER</span>
                </Button>
            </section>
        </form>
    )
}

export { SaleProductSearch };
