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
import { useInventoryItemUIStore } from "../infraestructura/stores/inventory-item-ui.store";
import { useInventoryItemDescripctionInput } from "./useInventoryItemSecripctionInput";

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

const useLocalTransferInventoryItemModal = () => {
    const {
        selectedInventoryId, inventoryItem, setInventoryItem
    } = useUpdateInventoryItemStore();
    const { closeInventoryItemModal, openInventoryItemModal, setFloatMessageState, inventoryItemLoading, runInventoryItemLoading, stopInventoryItemLoading } = useInventoryItemUIStore();

    const { register, handleSubmit, reset, setValue, watch, clearErrors, formState: { errors } } = useForm<RegisterFormData>({
        resolver: yupResolver(registerFormData) as any,
        mode: 'onChange',
        defaultValues: {
            quantityOnHand: 0,
        }
    });

    // Opciones para el select de unidad de compra
    const locationOptions = Object.values(LocationEnum).map(loc => ({
        value: loc,
        text: loc.charAt(0).toUpperCase() + loc.slice(1)
    }));

    const filterLocations = locationOptions.filter(item => item.value !== inventoryItem?.location?.toString());

    const inventoryItemDescription = useInventoryItemDescripctionInput;

    useEffect(()=>{
        if( inventoryItem && selectedInventoryId ){
            reset({
                location: inventoryItem?.location,
                quantityOnHand: inventoryItem?.quantityOnHan,
            });
        }
    }, [reset, inventoryItem, selectedInventoryId]);

    const resetFormLocalTransferInventoryItem = ()=> {
        setInventoryItem(null)
        reset({
            quantityOnHand: 0,
        });
        clearErrors([
            'location', 'quantityOnHand'
        ]);
        setFloatMessageState({});
    }

    const openLocalTransferInventoryItemModal = (inventoryItem: InventoryItemEntity)=> {
        setInventoryItem(inventoryItem);
        openInventoryItemModal('transfer');
    }

    const onSubmit = async (data: RegisterFormData) => {
        setFloatMessageState({});
        runInventoryItemLoading('transferring')

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
            stopInventoryItemLoading();
            if (result.ok) {
                setFloatMessageState({
                    summary: '¡Correcto!',
                    isActive: true,
                    type: 'green',
                    description: '¡Ubicacion registrado exitosamente!'
                });
                closeInventoryItemModal();
                setTimeout(() => {
                    setFloatMessageState({});
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
        }
    }

    return {
        openLocalTransferInventoryItemModal,
        register,
        handleSubmit,
        reset,
        setValue,
        watch,
        clearErrors,
        errors,
        resetFormLocalTransferInventoryItem,
        onSubmit,
        inventoryItem,
        inventoryItemDescription,
        filterLocations
    }
}

export { useLocalTransferInventoryItemModal };
