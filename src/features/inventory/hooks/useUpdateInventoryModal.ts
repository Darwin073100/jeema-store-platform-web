import { useForm } from "react-hook-form";
import * as yup from 'yup';
import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect, useState } from "react";
import { FloatMessageType } from "@/shared/ui/types/FloatMessageType";
import { useWorkspace } from "@/shared/hooks/useAuth";
import { useUpdateInventoryStore } from "../infraestructura/stores/update-inventory.store";
import { InventoryEntity } from "../domain/entities/inventory.entity";
import { UpdateInventoryDTO } from "../application/dtos/update-inventory.dto";
import { updateInventoryAction } from "../actions/update-inventory.action";
import { ProductEntity } from "@/features/product/domain/entities/product.entity";

const registerFormData = yup.object().shape({
    internalBarCode: yup
            .string()
            .required('El codigo de barra interno es obligatorio.')
            .typeError('Asegurate de ingresar la información correcta.'),
    salePriceOne     : yup
            .number()
            .required('El precio de venta por menudeo es obligatorio.')
            .positive('El precio de venta por menudeo debe ser positivo')
            .typeError('Asegurate de ingresar la información correcta.')
            .default(0),
    salePriceMany    : yup
            .number()
            .required('El precio de venta por mayoreo es obligatorio.')
            .positive('El precio de venta por mayoreo debe ser positivo')
            .typeError('Asegurate de ingresar la información correcta.')
            .default(0),
    saleQuantityMany : yup
            .number()
            .required('La cantidad para vender por mayoreo es obligatorio.')
            .positive('La cantidad para vender por mayoreo debe ser positivo')
            .typeError('Asegurate de ingresar la información correcta.')
            .default(0),
    minStockBranch   : yup
            .number()
            .required('El stock mínimo es obligatorio.')
            .positive('El stock mínimo debe ser positivo')
            .typeError('Asegurate de ingresar la información correcta.')
            .default(0),
    maxStockBranch   : yup
            .number()
            .required('El stock máximo es obligatorio.')
            .positive('El stock máximo debe ser positivo')
            .typeError('Asegurate de ingresar la información correcta.')
            .default(0),
});

type RegisterFormData = yup.InferType<typeof registerFormData>;

const useUpdateInventoryModal = () => {
    const { handleTrueUpdateOpenModal, handleFalseUpdateOpenModal, inventory, updateOpenModal, setInventory,
        selectedBranchOfficeId, selectedLotId, selectedProductId, setSelectedBranchOfficeId, setSelectedLotId, setSelectedProductId,
        selectedProduct, setSelectedProduct
    } = useUpdateInventoryStore();
    
    const [ isLoading, setIsLoading ] = useState<boolean>(false);
    const [ floatMessageState, setFloatMessageState ] = useState<FloatMessageType>({});

    const { register, handleSubmit, reset, setValue, watch, clearErrors, formState: { errors } } = useForm<RegisterFormData>({
        resolver: yupResolver(registerFormData) as any,
        mode: 'onChange'
    });

    useEffect(()=>{
        if( updateOpenModal ){
            reset({
                internalBarCode: inventory?.internalBarCode ?? '',
                salePriceOne: inventory?.salePriceOne ?? 0,
                salePriceMany: inventory?.salePriceMany ?? 0,
                saleQuantityMany: inventory?.saleQuantityMany ?? 0,
                minStockBranch: inventory?.minStockBranch ?? 0,
                maxStockBranch: inventory?.maxStockBranch ?? 0
            });
        }
    }, [reset, updateOpenModal, selectedBranchOfficeId, selectedLotId, selectedProductId]);

    const resetFormUpdateInventory = ()=> {
        setSelectedBranchOfficeId(null);
        setSelectedLotId(null);
        setSelectedProductId(null);

        reset({
            internalBarCode: '',
            salePriceOne: 0,
            salePriceMany: 0,
            saleQuantityMany: 0,
            minStockBranch: 0,
            maxStockBranch: 0
        });
        clearErrors([
            'maxStockBranch', 'minStockBranch', 'salePriceOne', 'internalBarCode',
            'salePriceMany', 'saleQuantityMany'
        ]);
        setFloatMessageState({});
    }

    const handleOpenModalInventory = (selectedInv: InventoryEntity, selectedProd: ProductEntity)=> {
        setInventory(selectedInv);
        setSelectedProduct(selectedProd);
        handleTrueUpdateOpenModal();
    }

    const handleUseUniversalBarCodeToLocal = ()=> {
        if( !selectedProduct ) return;
        reset({
            internalBarCode: selectedProduct?.universalBarCode ?? inventory?.internalBarCode ?? undefined
        });
    }

    const onSubmit = async (data: RegisterFormData) => {
        setFloatMessageState({});
        setIsLoading(true);

        try {

            const updateInventoryDto: UpdateInventoryDTO = {
                inventoryId: inventory?.inventoryId ?? BigInt(0),
                branchOfficeId: inventory?.branchOfficeId ?? BigInt(0),
                productId: inventory?.productId ?? BigInt(0),
                lotId: inventory?.lotId ?? BigInt(0),
                isSellable: inventory?.isSellable ?? true,
                internalBarCode: data.internalBarCode,
                salePriceOne: data.salePriceOne,
                salePriceMany: data.salePriceMany,
                salePriceSpecial: inventory?.salePriceSpecial,
                saleQuantityMany: data.saleQuantityMany,
                maxStockBranch: data.maxStockBranch,
                minStockBranch: data.minStockBranch
            }

            const result = await updateInventoryAction(updateInventoryDto);
            if (result.ok) {
                setFloatMessageState({
                    summary: '¡Correcto!',
                    isActive: true,
                    type: 'green',
                    description: '¡Inventario actualizado exitosamente!'
                });

                setTimeout(() => {
                    setFloatMessageState({});
                    handleFalseUpdateOpenModal();
                }, 3000);
            } else {
                const errorMessage = Array.isArray(result?.error) 
                    ? result.error.join(', ') 
                    : result?.error?.message || 'Error al actualizar un inventario';
                
                setFloatMessageState({
                    description: errorMessage,
                    summary: '¡Error!',
                    isActive: true,
                    type: 'red'
                });

                setTimeout(() => {
                    setFloatMessageState({});
                }, 4000);
            }
        } catch(error){
            setFloatMessageState({
                description: 'Error inesperado al actualizar un inventario',
                summary: '¡Error!',
                isActive: true,
                type: 'red'
            });

            setTimeout(() => {
                setFloatMessageState({});
            }, 4000);
        } finally {
            setIsLoading(false);
        }
    }

    return {
        handleFalseUpdateOpenModal,
        handleOpenModalInventory,
        updateOpenModal,
        register,
        handleSubmit,
        reset,
        setValue,
        watch,
        clearErrors,
        errors,
        resetFormUpdateInventory,
        onSubmit,
        // UI states
        floatMessageState,
        isLoading,
        handleUseUniversalBarCodeToLocal
    }
}

export { useUpdateInventoryModal };
