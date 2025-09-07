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

const useRegisterInventoryModal = () => {
    const { handleTrueSaveOpenModal, handleFalseSaveOpenModal, saveOpenModal, setSelectedProduct, selectedProduct,
         selectedLotId, selectedProductId, setSelectedBranchOfficeId, setSelectedLotId, setSelectedProductId
    } = useRegisterInventoryStore();
    const { branchOffice } = useWorkspace();
    
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
                salePriceMany: 0,
                saleQuantityMany: 0,
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

    const handleRegisterOpenModalInventory = ( lotId: bigint, selectedProd: ProductEntity)=> {
        setSelectedLotId(lotId);
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

    const onSubmit = async (data: RegisterFormData) => {
        setFloatMessageState({});
        setIsLoading(true);

        try {

            const registerInventoryDto: RegisterInventoryDTO = {
                branchOfficeId: branchOffice?.branchOfficeId? BigInt(branchOffice?.branchOfficeId): BigInt(0),
                productId: selectedProductId ?? BigInt(0),
                lotId: selectedLotId ?? BigInt(0),
                isSellable: true,
                internalBarCode: data.internalBarCode,
                salePriceOne: data.salePriceOne,
                salePriceMany: data.salePriceMany,
                saleQuantityMany: data.saleQuantityMany,
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
        isLoading
    }
}

export { useRegisterInventoryModal };
