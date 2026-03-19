import { useForm } from "react-hook-form";
import * as yup from 'yup';
import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect, useState } from "react";
import { FloatMessageType } from "@/shared/ui/types/FloatMessageType";
import { useRegisterInventoryItemStore } from "../stores/register-inventory-item.store";
import { registerInventoryItemAction } from "../actions/register-inventory-item.action";
import { LocationEnum } from "@/contexts/inventory-management/inventory-item/domain/enums/location.enum";

const registerFormData = yup.object().shape({
    location: yup
        .mixed<LocationEnum>()
        .oneOf(Object.values(LocationEnum), 'La ubicación del stock debe ser un valor válido.')
        .required('La ubicación del stock es obligatoria.')
        .typeError('Asegurate de ingresar la información correcta.'),
    quantityOnHand: yup
        .number()
        .required('El stock para la ubicación asignada es obligatorio.')
        .typeError('Asegurate de ingresar la información correcta.')        
});

type RegisterFormData = yup.InferType<typeof registerFormData>;

const useRegisterInventoryItemModal = () => {
    const { handleTrueSaveOpenModal, handleFalseSaveOpenModal, saveOpenModal,
        selectedInventoryId, setSelectedInventoryId, setInventoryItems, inventoryItems
    } = useRegisterInventoryItemStore();
    
    const [ isLoading, setIsLoading ] = useState<boolean>(false);
    const [ floatMessageState, setFloatMessageState ] = useState<FloatMessageType>({});

    const { register, handleSubmit, reset, setValue, watch, clearErrors, formState: { errors } } = useForm<RegisterFormData>({
        resolver: yupResolver(registerFormData) as any,
        defaultValues:{
            quantityOnHand: 0
        },
        mode: 'onChange'
    });

    useEffect(()=>{
        if( saveOpenModal ){
            reset({
                location: LocationEnum.SALE,
                quantityOnHand: 0,
            });
        }
    }, [reset, saveOpenModal, selectedInventoryId]);

    const resetFormRegisterInventory = ()=> {
        setSelectedInventoryId(null);

        reset({
            location: LocationEnum.SALE,
            quantityOnHand: 0,
        });
        clearErrors([
            'location', 'quantityOnHand'
        ]);
        setFloatMessageState({});
    }

    const handleOpenModalInventoryItem = (inventoryId: bigint | null)=> {
        setSelectedInventoryId(inventoryId);
        handleTrueSaveOpenModal();
    }

    const onSubmit = async (data: RegisterFormData) => {
        setFloatMessageState({});
        setIsLoading(true);

        try {

            const registerInventoryItemDto = {
                inventoryId: selectedInventoryId ?? BigInt(0),
                lastStockedAt: new Date(),
                purchasePriceAtStock:  0,
                location: data.location,
                quantityOnHan: data.quantityOnHand,
                internalBarCode: undefined,
            }

            const result = await registerInventoryItemAction(registerInventoryItemDto);
            if (result.ok) {
                setFloatMessageState({
                    summary: '¡Correcto!',
                    isActive: true,
                    type: 'green',
                    description: '¡Ubicacion registrado exitosamente!'
                });

                setTimeout(() => {
                    setFloatMessageState({});
                    handleFalseSaveOpenModal();
                }, 3000);
            } else {
                const errorMessage = Array.isArray(result?.error) 
                    ? result.error.join(', ') 
                    : result?.error?.message || 'Error al registrar un ubicacion';
                
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
                description: 'Error inesperado al registrar un ubicacion',
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
        handleOpenModalInventoryItem,
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

export { useRegisterInventoryItemModal };
