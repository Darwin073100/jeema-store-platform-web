import { useForm } from "react-hook-form";
import * as yup from 'yup';
import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect, useState } from "react";
import { FloatMessageType } from "@/shared/ui/types/FloatMessageType";
import { LocationEnum } from "../../../../../features/inventory/domain/enums/location.enum";
import { registerInventoryItemAction } from "../actions/register-inventory-item.action";
import { useUpdateInventoryItemStore } from "../stores/update-inventory-item.store";
import { InventoryItemEntity } from "../../../../../features/inventory/domain/entities/inventory-item-response.dto";
import { UpdateInventoryItemDTO } from "../../../../../features/inventory/application/dtos/update-inventory-item.dto";
import { updateInventoryItemAction } from "../actions/update-inventory-item.action";
import { useInventoryItemUIStore } from "../stores/inventory-item-ui.store";
import { useInventoryItemDescripctionInput } from "./useInventoryItemSecripctionInput";
import { LocalTransferDTO } from "@/features/transfer/application/dtos/local-transfer.dto";
import { localTransferAction } from "@/features/transfer/actions/local-transfer.action";
import { IInventoryItem } from "@/contexts/inventory-management/inventory-item/presentation/interfaces/IInventoryItem";

const registerFormData = yup.object().shape({
    location: yup
        .mixed<LocationEnum>()
        .oneOf(Object.values(LocationEnum), 'La ubicación del stock debe ser un valor válido.')
        .required('La ubicación del stock es obligatoria.')
        .typeError('Asegurate de ingresar la información correcta.'),
    quantityOnHand: yup
        .number()
        .required('El stock para la ubicación asignada es obligatorio.')
        .typeError('Asegurate de ingresar la información correcta.'),
    notes: yup
        .string()
        .optional()
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
    }

    const openLocalTransferInventoryItemModal = (inventoryItem: IInventoryItem)=> {
        setInventoryItem(inventoryItem);
        openInventoryItemModal('transfer');
    }

    const onSubmit = async (data: RegisterFormData) => {
        setFloatMessageState({});
        runInventoryItemLoading('transferring')
        try {
            const dto = {
                inventoryId: inventoryItem?.inventoryId ?? BigInt(0),
                fromLocation: inventoryItem?.location ?? LocationEnum.STOCK,
                toLocation: data.location,
                quantity: data.quantityOnHand,
                notes: data.notes || null,
            }

            const result = await localTransferAction(dto);

            stopInventoryItemLoading();

            if (result.ok) {
                setFloatMessageState({
                    summary: '¡Correcto!',
                    isActive: true,
                    type: 'green',
                    description: '¡Traspaso exitoso!'
                });
                closeInventoryItemModal();
                resetFormLocalTransferInventoryItem();
                setTimeout(() => {
                    setFloatMessageState({});
                }, 3000);
            } else {
                const errorMessage = Array.isArray(result?.error)
                    ? result.error.join(', ')
                    : result?.error?.message || 'Error al traspasar la mercancía de ubicación.';

                setFloatMessageState({
                    description: errorMessage,
                    summary: result.error?.statusCode ? `${result.error?.statusCode}: ¡Error!` : '500: ¡Error!',
                    isActive: true,
                    type: 'red'
                });

                setTimeout(() => {
                    setFloatMessageState({});
                }, 4000);
            }
        } catch(error){
            setFloatMessageState({
                description: 'Error inesperado al traspasar la mercancía de ubicación.',
                summary: '500: ¡Error!',
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
