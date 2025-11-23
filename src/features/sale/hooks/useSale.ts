'use client';
import { findInventoryByBarCodeAction } from "@/features/inventory/actions/find-inventory-by-bar-code.action";
import { InventoryEntity } from "@/features/inventory/domain/entities/inventory.entity";
import { useEffect, useRef, useState } from "react";
import { useSaleStore } from "../infraestructure/stores/sale.store";
import { findSaleWithDetailAction } from "../actions/find-sale-by-id-with-detail.action";
import { AddDetailToSaleDto } from "../application/dtos/add-detail-to-sale.dto";
import { useSaleUIStore } from "../infraestructure/stores/sale.ui.store";
import { CreateSaleAndAddDetailAction } from "../actions/create-sale-and-add-detail.action";
import { SaleForEnum } from "../domain/enums/sale-for.enum";

const useSale = () => {

    const [searchValue, setSearchValue] = useState<string>('');
    const { setFloatMessageState, loading, initLoading, finishLoading } = useSaleUIStore();
    const { sale, setSale, saleId, setSaleId, cashSessionActive } = useSaleStore();

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
    /**
     * Calculo de precios por:
     * - Mayore
     * - Menudeo
     * - Especial
     */
    //TODO: Usar el modificador manual en update detail
    const hancleCalculateDetailPrice = (inventory: InventoryEntity, quantity: number, priceSpecial?: number) => {
        let finalPrice: number | undefined;
        let saleFor: SaleForEnum;

        if (quantity >= Number(inventory.saleQuantityMany ?? 0)) {
            saleFor = SaleForEnum.MANY;
        } else if (quantity < Number(inventory.saleQuantityMany ?? 0)) {
            saleFor = SaleForEnum.ONE;
        } else {
            saleFor = SaleForEnum.SPECIAL;
            finalPrice = priceSpecial? Number(priceSpecial): undefined;
        }

        const detailDto: AddDetailToSaleDto = {
            quantity: quantity,
            specialprice: finalPrice,
            saleFor: saleFor,
            productBarCodeAtSale: inventory.internalBarCode || '',
            productUnitAtSale: inventory.product?.unitOfMeasure || 'PIEZA',
            notes: `Agregado el ${new Date().toLocaleString()}`
        };
        return detailDto;
    }

    const handleSearchInventory = async (barCode: string) => {
        initLoading('findInventoryItemsLoading');
        if(!cashSessionActive){
            setFloatMessageState({
                summary: '404: ¡Error! 😢',
                description: 'Debes aperturar caja para poder vender',
                type: 'red',
                isActive: true
            });
            handleResetSearch();
            setTimeout(() => {
                setFloatMessageState({});
            }, 4000);
            return;
        }
        // Buscar el producto, haciendo el request al servidor
        const searchResult = await findInventoryByBarCodeAction(barCode);
        if (!searchResult.ok || !searchResult.value) {
            setFloatMessageState({
                summary: '¡Error!',
                description: searchResult.error?.message,
                type: 'red',
                isActive: true
            });
            handleResetSearch();
            setTimeout(() => {
                setFloatMessageState({});
            }, 4000);
        } else {
            // Seteamos el estado del inventory con el producto encontrado
            const foundInventory = searchResult.value;

            // Preparar el detalle del producto, para modificar la cantidad
            // Ej: Se utilizará para cuando hay 5 productos, sumarle 1, para que sean ahora 6.
            const existingProduct = sale?.saleDetails?.find(
                detail => detail.productBarCodeAtSale === (foundInventory.internalBarCode || '')
            );

            const finalQuantity = Number(existingProduct?.quantity ?? 0) + 1;
            const detailDto = hancleCalculateDetailPrice(foundInventory, finalQuantity);
            const resultSale = await CreateSaleAndAddDetailAction(saleId, BigInt(1), cashSessionActive.cashRegisterId, detailDto);
            if (!resultSale.ok) {
                setFloatMessageState({
                    type: 'red',
                    summary: '¡Hay un error!',
                    description: resultSale.error?.message ?? 'Ha ocurrido un error al agregar el producto a la venta.',
                    isActive: true,
                });
                setTimeout(() => {
                    setFloatMessageState({});
                }, 2000);
            } else {
                // Validar que venga un value para actualizar el estado de la venta.
                resultSale.value ?
                    setSale(resultSale.value) : null;
                resultSale.value ?
                    setSaleId(resultSale.value.saleId) : null;

                setFloatMessageState({
                    type: 'green',
                    summary: '¡Correcto!',
                    description: 'Se ha agregado el producto a la venta...',
                    isActive: true
                });
                setFloatMessageState({});
            }
            handleResetSearch();
        }
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        handleSearchInventory(searchValue);
    }
    const handleChangeSearch = (e: React.FormEvent<HTMLInputElement>) => {
        setSearchValue(e.currentTarget.value);
    }

    const handleResetSearch = () => {
        finishLoading();
        setSearchValue('');
    }

    const handleUpdateSaleDetails = async (id: bigint)=>{
        const result = await findSaleWithDetailAction(id);
        if(result.ok && result.value){
            setSale(result.value);
        }
    }

    return {
        handleUpdateSaleDetails,
        hancleCalculateDetailPrice,
        handleChangeSearch,
        searchValue,
        handleSubmit,
        inputRef,
        loading,
    }
}

export { useSale }
