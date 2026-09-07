'use client'
import React, { useEffect, useState } from "react";
import { Button } from "@/shared/ui/components/buttons";
import { TextInput } from "@/shared/ui/components/inputs";
import { IoIosBarcode, IoMdCheckmark } from "react-icons/io";
import { IoCameraOutline } from "react-icons/io5";
import { useSale } from "../hooks/useSale";
import { Spinner } from "@/shared/ui/components/loadings/Spinner";
import { useSaleStore } from "../stores/sale.store";
import { ICashSession } from "@/contexts/cash-management/cash-session/presentation/interfaces/ICashSession";
import { BarcodeScannerModal } from "@/shared/ui/components/scanner/BarcodeScannerModal";
interface Props {
    cashSession: ICashSession | null;
}
const SaleProductSearch = ({ cashSession }: Props) => {
    const { handleSubmit, inputRef, handleChangeSearch, handleSearchInventory, searchValue, loading } = useSale();
    const { setCashSessionActive } = useSaleStore();
    const [isScannerOpen, setIsScannerOpen] = useState(false);

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
                    inputMode="none"
                    value={searchValue}
                    onChange={handleChangeSearch}
                    placeholder="Escanea o escribe el código de barras" />
                <button
                    type="button"
                    onClick={() => setIsScannerOpen(true)}
                    className="text-white text-2xl px-3 py-2 hover:text-blue-200 transition-colors cursor-pointer"
                    aria-label="Escanear con la cámara"
                    title="Escanear con la cámara"
                >
                    <IoCameraOutline />
                </button>
            </section>
            <section className="flex w-1/3">
                <Button className="w-full justify-center shadow-md hover:shadow-lg transition-all">
                    <IoMdCheckmark className="text-xl max-sm:hidden" />
                    <span className="flex-1 max-md:hidden">Agregar producto</span>
                    <span className="text-xs bg-white/20 px-2 py-1 rounded">ENTER</span>
                </Button>
            </section>
            <BarcodeScannerModal
                isOpen={isScannerOpen}
                onClose={() => setIsScannerOpen(false)}
                onDetected={(code) => handleSearchInventory(code)}
            />
        </form>
    )
}

export { SaleProductSearch };
