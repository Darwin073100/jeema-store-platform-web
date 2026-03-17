import { useForm } from "react-hook-form";
import { useRegisterInventoryStore } from "../infraestructura/stores/register-inventory.store";
import * as yup from 'yup';
import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect, useState } from "react";
import { FloatMessageType } from "@/shared/ui/types/FloatMessageType";
import { RegisterInventoryDTO } from "../application/dtos/register-inventory.dto";
import { registerInventoryAction } from "../actions/register-inventory.action";
import { useWorkspace } from "@/shared/hooks/useAuth";
import { ProductEntity } from "@/features/product/domain/entities/product.entity";
import { useProductUIStore } from "@/contexts/product-management/product/presentation/stores/product-ui.store";
import { generateBarcodeAction } from "../actions/generate-barcode.action";
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
            .notRequired()
            .optional()
            .nullable()
            .typeError('Asegurate de ingresar la información correcta.'),
    saleQuantityMany : yup
            .string()
            .notRequired()
            .optional()
            .nullable()
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

const useRegisterInventoryModal = () => {
    const { handleTrueSaveOpenModal, handleFalseSaveOpenModal, saveOpenModal, setSelectedProduct, selectedProduct,
         selectedLotId, selectedProductId, setSelectedBranchOfficeId, setSelectedLotId, setSelectedProductId
    } = useRegisterInventoryStore();
    const { branchOffice } = useWorkspace();
    const {initLoading, finishLoading} = useProductUIStore();
    
    const [ isLoading, setIsLoading ] = useState<boolean>(false);
    const [ floatMessageState, setFloatMessageState ] = useState<FloatMessageType>({});

    const { register, handleSubmit, reset, setValue, watch, clearErrors, formState: { errors } } = useForm<RegisterFormData>({
        resolver: yupResolver(registerFormData) as any,
        mode: 'onChange'
    });

    useEffect(()=>{
        if( saveOpenModal ){
            reset({
                internalBarCode: '',
                salePriceOne: 0,
                salePriceMany: '0',
                saleQuantityMany: '0',
                minStockBranch: 0,
                maxStockBranch: 0
            });
        }
    }, [reset, saveOpenModal, selectedLotId, selectedProductId]);

    const resetFormRegisterInventory = ()=> {
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

    const handleRegisterOpenModalInventory = (selectedProd: IProduct)=> {
        setSelectedProductId(selectedProd.productId);
        setSelectedProduct(selectedProd);
        handleTrueSaveOpenModal();
    }

    const handleUseUniversalBarCodeToLocal = ()=> {
        if( !selectedProduct ) return;
        reset({
            internalBarCode: selectedProduct?.universalBarCode ?? undefined
        });
    }

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

    const onSubmit = async (data: RegisterFormData) => {
        setFloatMessageState({});
        setIsLoading(true);

        try {

            const registerInventoryDto: RegisterInventoryDTO = {
                branchOfficeId: branchOffice?.branchOfficeId? BigInt(branchOffice?.branchOfficeId): BigInt(0),
                productId: selectedProductId ?? BigInt(0),
                isSellable: true,
                internalBarCode: data.internalBarCode,
                salePriceOne: data.salePriceOne,
                salePriceMany: data.salePriceMany? Number(data.salePriceMany): null,
                saleQuantityMany: data.saleQuantityMany? Number(data.saleQuantityMany): null,
                maxStockBranch: data.maxStockBranch,
                minStockBranch: data.minStockBranch
            }

            const result = await registerInventoryAction(registerInventoryDto);
            if (result.ok) {
                setFloatMessageState({
                    summary: '¡Correcto!',
                    isActive: true,
                    type: 'green',
                    description: '¡Inventario registrado exitosamente!'
                });

                setTimeout(() => {
                    setFloatMessageState({});
                    handleFalseSaveOpenModal();
                }, 3000);
            } else {
                const errorMessage = Array.isArray(result?.error) 
                    ? result.error.join(', ') 
                    : result?.error?.message || 'Error al registrar un inventario';
                
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
                description: 'Error inesperado al registrar un inventario',
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
        handleFalseSaveOpenModal,
        handleRegisterOpenModalInventory,
        handleUseUniversalBarCodeToLocal,
        saveOpenModal,
        register,
        handleSubmit,
        reset,
        setValue,
        watch,
        clearErrors,
        errors,
        resetFormRegisterInventory,
        onSubmit,
        // UI states
        floatMessageState,
        isLoading,
        handleGenerateBarcode
    }
}

export { useRegisterInventoryModal };
