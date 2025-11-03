import { useForm } from "react-hook-form";
import * as yup from 'yup';
import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect, useState } from "react";
import { FloatMessageType } from "@/shared/ui/types/FloatMessageType";
import { LocationEnum } from "../domain/enums/location.enum";
import { registerInventoryItemAction } from "../actions/register-inventory-item.action";
import { useUpdateInventoryItemStore } from "../infraestructura/stores/update-inventory-item.store";
import { InventoryItemEntity } from "../domain/entities/inventory-item-response.dto";
import { UpdateInventoryItemDTO } from "../application/dtos/update-inventory-item.dto";
import { updateInventoryItemAction } from "../actions/update-inventory-item.action";

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

const useUpdateInventoryItemModal = () => {
    const { handleTrueUpdateOpenModal, handleFalseUpdateOpenModal, updateOpenModal,
        selectedInventoryId, inventoryItem, setInventoryItem
    } = useUpdateInventoryItemStore();
    
    const [ isLoading, setIsLoading ] = useState<boolean>(false);
    const [ floatMessageState, setFloatMessageState ] = useState<FloatMessageType>({});

    const { register, handleSubmit, reset, setValue, watch, clearErrors, formState: { errors } } = useForm<RegisterFormData>({
        resolver: yupResolver(registerFormData) as any,
        mode: 'onChange',
        defaultValues: {
            quantityOnHand: 0
        }
    });

    useEffect(()=>{
        if( updateOpenModal ){
            reset({
                location: inventoryItem?.location,
                quantityOnHand: inventoryItem?.quantityOnHan,
            });
        }
    }, [reset, updateOpenModal, selectedInventoryId]);

    const resetFormRegisterInventory = ()=> {
        setInventoryItem(null)

        reset({
            location: LocationEnum.SALE,
            quantityOnHand: 0,
        });
        clearErrors([
            'location', 'quantityOnHand'
        ]);
        setFloatMessageState({});
    }

    const handleOpenModalUpdateInventoryItem = (inventoryItem: InventoryItemEntity)=> {
        setInventoryItem(inventoryItem);
        handleTrueUpdateOpenModal();
    }

    const onSubmit = async (data: RegisterFormData) => {
        setFloatMessageState({});
        setIsLoading(true);

        try {

            const registerInventoryItemDto: UpdateInventoryItemDTO = {
                inventoryItemId: inventoryItem?.inventoryItemId ?? BigInt(0),
                inventoryId: inventoryItem?.inventoryId ?? BigInt(0),
                lastStockedAt: inventoryItem?.lastStockedAt? new Date(inventoryItem.lastStockedAt): new Date(),
                purchasePriceAtStock: inventoryItem?.purchasePriceAtStock ?? 0,
                location: data.location,
                quantityOnHan: data.quantityOnHand,
                internalBarCode: inventoryItem?.internalBarCode
            }


            const result = await updateInventoryItemAction(registerInventoryItemDto);
            if (result.ok) {
                setFloatMessageState({
                    summary: '¡Correcto!',
                    isActive: true,
                    type: 'green',
                    description: '¡Ubicacion registrado exitosamente!'
                });

                setTimeout(() => {
                    setFloatMessageState({});
                    handleFalseUpdateOpenModal();
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
        handleFalseUpdateOpenModal,
        handleOpenModalUpdateInventoryItem,
        updateOpenModal,
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

export { useUpdateInventoryItemModal };
