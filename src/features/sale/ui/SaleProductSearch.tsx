'use client'
import React, { useEffect, useRef }  from "react";
import { Button } from "@/ui/components/buttons";
import { TextInput } from "@/ui/components/inputs";
import { IoIosBarcode, IoMdCheckmark } from "react-icons/io";
import { useSearchInventory } from "../hooks/useSearchInventory";
import { FloatMessage } from "@/ui/components/messages";

const SaleProductSearch = () => {
    const { handleSubmit, floatMessageState, inputRef, handleChangeSearch, searchValue } = useSearchInventory();


    return (
        <form  
            onSubmit={handleSubmit}
            className="flex gap-4 items-center w-full justify-between">
            <section className="flex bg-gradient-to-r from-blue-600 to-blue-700 w-full items-center rounded-xl shadow-md gap-4 pl-4">
                <IoIosBarcode className="text-white text-2xl" />
                <TextInput
                    ref={inputRef}
                    autoFocus
                    value={searchValue}
                    onChange={handleChangeSearch}
                    placeholder="Escanea o escribe el código de barras" />
            </section>
            <section className="flex w-1/3">
                <Button className="w-full justify-center shadow-md hover:shadow-lg transition-all">
                    <IoMdCheckmark className="text-xl" />
                    <span className="flex-1">Agregar producto</span>
                    <span className="text-xs bg-white/20 px-2 py-1 rounded">ENTER</span>
                </Button>
            </section>
            <FloatMessage 
                {...floatMessageState}/>
        </form>
    )
}

export { SaleProductSearch };
