import { useForm } from "react-hook-form";
import * as yup from 'yup';
import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect, useState } from "react";
import { FloatMessageType } from "@/shared/ui/types/FloatMessageType";
import { useUpdateInventoryStore } from "../infraestructura/stores/update-inventory.store";
import { UpdateInventoryDTO } from "../application/dtos/update-inventory.dto";
import { updateInventoryAction } from "../actions/update-inventory.action";
import { generateBarcodeAction } from "../actions/generate-barcode.action";
import { useProductUIStore } from "@/features/product/infraestructure/stores/product-ui.store";
import { IInventory } from "@/contexts/inventory-management/inventory/presentation/interfaces/IInventory";
import { IProduct } from "@/contexts/product-management/product/presentation/interfaces/IProduct";

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
            .string()
            .optional()
            .typeError('Asegurate de ingresar la información correcta.'),
    saleQuantityMany : yup
            .string()
            .optional()
            .typeError('Asegurate de ingresar la información correcta.'),
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
    const {initLoading, finishLoading} = useProductUIStore();
    
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
                salePriceMany: inventory?.salePriceMany? inventory?.salePriceMany.toString(): undefined,
                saleQuantityMany: inventory?.saleQuantityMany? inventory?.saleQuantityMany.toString():  undefined,
                minStockBranch: inventory?.minStockBranch ?? 0,
                maxStockBranch: inventory?.maxStockBranch ?? 0
            });
        }
    }, [reset, updateOpenModal, selectedBranchOfficeId, selectedLotId, selectedProductId]);

    const handleGenerateBarcode = async ()=>{
            initLoading('generateBarcode');
            const response = await generateBarcodeAction();
            finishLoading();
            if (response.ok && response.value) {
                setValue('internalBarCode', response.value.barcode);
                setFloatMessageState(() => ({
                    description: 'Código generado',
                    summary: '¡Correcto!',
                    isActive: true,
                    type: 'green'
                }));
                setTimeout(() => {
                    setFloatMessageState(() => ({}));
                }, 2000);
            } else {
                setFloatMessageState(() => ({
                    description: 'No se pudo generrar el código de barra.',
                    summary: '¡Error!',
                    isActive: true,
                    type: 'red'
                }));
                setTimeout(() => {
                    setFloatMessageState(() => ({}));
                }, 4000);
            }
        }

    const resetFormUpdateInventory = ()=> {
        setSelectedBranchOfficeId(null);
        setSelectedLotId(null);
        setSelectedProductId(null);

        reset({
            internalBarCode: '',
            salePriceOne: 0,
            salePriceMany: '0',
            saleQuantityMany: '0',
            minStockBranch: 0,
            maxStockBranch: 0
        });
        clearErrors([
            'maxStockBranch', 'minStockBranch', 'salePriceOne', 'internalBarCode',
            'salePriceMany', 'saleQuantityMany'
        ]);
        setFloatMessageState({});
    }

    const handleOpenModalInventory = (selectedInv: IInventory | null, selectedProd: IProduct)=> {
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
                isSellable: inventory?.isSellable ?? true,
                internalBarCode: data.internalBarCode,
                salePriceOne: data.salePriceOne,
                salePriceMany: data.salePriceMany? Number(data.salePriceMany): null,
                salePriceSpecial: inventory?.salePriceSpecial,
                saleQuantityMany: data.saleQuantityMany? Number(data.saleQuantityMany): null,
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
        handleUseUniversalBarCodeToLocal,
        handleGenerateBarcode
    }
}

export { useUpdateInventoryModal };
