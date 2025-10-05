'use client';
import { findInventoryByBarCodeAction } from "@/features/inventory/actions/find-inventory-by-bar-code.action";
import { InventoryEntity } from "@/features/inventory/domain/entities/inventory.entity";
import { useWorkspace } from "@/shared/hooks/useAuth";
import { useEffect, useRef, useState } from "react";
import { useSaleStore } from "../infraestructure/stores/sale.store";
import { registerSaleInitialAction } from "../actions/register-sale-initial.action";
import { findSaleWithDetailAction } from "../actions/find-sale-by-id-with-detail.action";
import { AddDetailToSaleDto } from "../application/dtos/add-detail-to-sale.dto";
import { addDetailToSaleAction } from "../actions/add-detail-to-sale.action";
import { useSaleUIStore } from "../infraestructure/stores/sale.ui.store";

const useSale = () => {
    const [inventory, setInventory] = useState<InventoryEntity>();
    const [searchValue, setSearchValue] = useState<string>('');
    const { branchOffice, employee } = useWorkspace();
    const { setFloatMessageState, loading, initLoading, finishLoading} = useSaleUIStore();
    const { sale, setSale, saleId, setSaleId } = useSaleStore();

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
            initLoading('findInventoryItemsLoading');
            
            // 1. Buscar el producto en el inventario
            const result = await findInventoryByBarCodeAction(barCode);
            if (!result.ok) {
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
                return;
            }

            if (!result.value) {
                throw new Error('No se encontró el producto en el inventario');
            }

            const foundInventory = result.value;
            setInventory(foundInventory);

            // 2. Asegurarse de que existe una venta activa
            let currentSaleId = saleId;
            
            if (!currentSaleId || !sale) {
                if (!branchOffice?.branchOfficeId || !employee?.employeeId) {
                    throw new Error('No se pudo obtener la información de la sucursal o empleado');
                }

                const createSaleResult = await registerSaleInitialAction({
                    branchOfficeId: BigInt(branchOffice.branchOfficeId),
                    employeeId: BigInt(employee.employeeId),
                    customerId: BigInt(2)
                });

                if (!createSaleResult?.ok || !createSaleResult.value?.saleId) {
                    throw new Error('No se pudo crear la venta');
                }

                currentSaleId = createSaleResult.value.saleId;
                setSaleId(currentSaleId);

                // Esperar a que se actualice la venta en el store
                await handleUpdateSaleDetails(currentSaleId);
            }

            // 3. Verificar que tenemos una venta válida
            if (!currentSaleId) {
                throw new Error('No se pudo inicializar la venta');
            }

            // 4. Preparar el detalle del producto
            const existingProduct = sale?.saleDetails?.find(
                detail => detail.productBarCodeAtSale === (foundInventory.internalBarCode || '')
            );

            const detailDto: AddDetailToSaleDto = {
                quantity: existingProduct ? Number(existingProduct.quantity) + 1 : 1,
                unitPriceAtSale: Number(foundInventory.salePriceOne || 0),
                productBarCodeAtSale: foundInventory.internalBarCode || '',
                productUnitAtSale: foundInventory.product?.unitOfMeasure || 'PIEZA',
                notes: `Agregado el ${new Date().toLocaleString()}`
            };

            // 5. Agregar el detalle a la venta
            const addedSuccessfully = await handleAddDetailToSale(currentSaleId, detailDto);
            
            if (addedSuccessfully) {
                setFloatMessageState({
                    summary: 'Producto agregado',
                    description: `Se agregó ${foundInventory.product?.name} a la venta`,
                    type: 'green',
                    isActive: true
                });
                setTimeout(() => {
                    setFloatMessageState({});
                }, 2000);
            }

            handleResetSearch();

        } catch (error: any) {
            setFloatMessageState({
                summary: '¡Error!',
                description: error.message || 'Error al procesar el producto',
                type: 'red',
                isActive: true
            });
            setTimeout(() => {
                setFloatMessageState({});
            }, 4000);
        } finally {
            finishLoading();
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

    const handleAddDetailToSale = async (saleId: bigint, dto: AddDetailToSaleDto) => {
        try {
            const addResult = await addDetailToSaleAction(saleId, dto);
            if (!addResult?.ok) {
                console.log(addResult);
                const errorMessage = addResult?.error?.message
                throw new Error('Ocurrio un error al agregar el producto');
            }
            
            // Actualizar los detalles de la venta
            await handleUpdateSaleDetails(saleId);
            return true;
        } catch (error: any) {
            const errorMessage = typeof error.message === 'string' 
                ? error.message 
                : 'Error al agregar el producto a la venta';
            
            setFloatMessageState({
                summary: '¡Error!',
                description: errorMessage,
                type: 'red',
                isActive: true
            });
            setTimeout(() => {
                setFloatMessageState({});
            }, 4000);
            return false;
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
        finishLoading();
        setSearchValue('');
    }


    return {
        handleUpdateSaleDetails,
        handleChangeSearch,
        searchValue,
        handleSubmit,
        inputRef,
        loading,
    }
}

export { useSale }
