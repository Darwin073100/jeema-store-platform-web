'use client'
import * as yup from 'yup';
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { v4 as UUID } from 'uuid'
import { useEffect, useState } from "react";
import { FloatMessageType } from "@/shared/ui/types/FloatMessageType";
import { RegisterLotDTO } from "../../../../../features/lot/application/dtos/register-lot.dto";
import { useRegisterLotModalStore } from "../stores/register-lot-modal.store";
import { formatDateForInput } from '@/shared/lib/utils/date-formatter';
import { registerLotWithInventoryItemAction } from '../actions/register-lot-with-inventory-item.action';
import { ForSaleEnum } from '@/shared/domain/enums/for-sale.enum';
import { LocationEnum } from '@/contexts/inventory-management/inventory-item/domain/enums/location.enum';

// Schema de validación Yup para registrar un lote
export const registerLotSchema = yup.object().shape({
    inventoryItemId: yup
            .string()
            .optional()
            .default('0')
            .typeError(`Asegurate de ingresar la información correcta, Ej: (${Object.values(LocationEnum)}).`),
    suplierId: yup
            .string()
            .optional()
            .default('0')
            .typeError(`Asegurate de ingresar la información correcta.`),
    purchasePrice: yup
        .number()
        .required('El precio de compra es obligatorio.')
        .positive('El precio de compra debe ser mayor a cero.')
        .test('max-decimals', 'El precio de compra debe ser un número con hasta 4 decimales.', 
              value => value === undefined || Number(value.toFixed(4)) === value),

    initialQuantity: yup
        .number()
        .required('La cantidad inicial es obligatoria.')
        .positive('La cantidad inicial debe ser mayor a cero.')
        .test('max-decimals', 'La cantidad inicial debe ser un número con hasta 3 decimales.', 
              value => value === undefined || Number(value.toFixed(3)) === value),

    purchaseUnit: yup
        .mixed<ForSaleEnum>()
        .oneOf(Object.values(ForSaleEnum), 'La unidad de compra debe ser un valor válido.')
        .required('La unidad de compra es obligatoria.'),

    expirationDate: yup
        .string()
        .optional()
        .nullable()
        .test('is-valid-date', 'La fecha de caducidad debe ser una fecha válida (YYYY-MM-DD).', 
              value => !value || !isNaN(Date.parse(value))),

    manufacturingDate: yup
        .string()
        .optional()
        .nullable()
        .test('is-valid-date', 'La fecha de fabricación debe ser una fecha válida (YYYY-MM-DD).', 
              value => !value || !isNaN(Date.parse(value))),
    receivedDate: yup
        .string()
        .required('La fecha de recepción es obligatoria.')
        .test('is-valid-date', 'La fecha de recepción debe ser una fecha válida (YYYY-MM-DD).', 
              value => Boolean(value && !isNaN(Date.parse(value))))
});

export type RegisterFormData = yup.InferType<typeof registerLotSchema>;

const useRegisterLotModal = () => {
    const [floatMessageState, setFloatMessageState] = useState<FloatMessageType>({});
    const [isLoading, setIsLoading] = useState<boolean>(false);
    
    // Usar el store global para el estado del modal
    const { 
        openModal, 
        selectedProductId, 
        handleOpenRegisterLotModal, 
        handleCloseRegisterLotModal,
        setSelectedProductId,
    } = useRegisterLotModalStore();

    const { register, handleSubmit, reset, setValue, watch, clearErrors, formState: { errors } } = useForm<RegisterFormData>({
        resolver: yupResolver(registerLotSchema) as any,
        mode: 'onChange',
    });

    // Configurar valores por defecto cuando se abre el modal
    useEffect(() => {
        if (openModal && selectedProductId) {
            reset({
                suplierId: undefined,
                purchasePrice: 0,
                initialQuantity: 0,
                purchaseUnit: ForSaleEnum.PC,
                expirationDate: '',
                manufacturingDate: '',
                receivedDate: formatDateForInput(new Date()),
            });
        }
    }, [openModal, selectedProductId, reset]);

    const resetFormRegisterLot = () => {
        setSelectedProductId('');
        reset({
            suplierId: undefined,
            purchasePrice: 0,
            initialQuantity: 0,
            purchaseUnit: ForSaleEnum.PC,
            expirationDate: '',
            manufacturingDate: '',
            receivedDate: formatDateForInput(new Date()),
            inventoryItemId: undefined
        });
        clearErrors(['purchasePrice', 'initialQuantity', 'suplierId', 
            'purchaseUnit', 'expirationDate', 'manufacturingDate', 'receivedDate'
        ]);
        setFloatMessageState({});
    }

    const handleCloseModal = () => {
        handleCloseRegisterLotModal();
        resetFormRegisterLot();
    }

    const onSubmit = async (data: RegisterFormData) => {
        setFloatMessageState({});
        setIsLoading(true);

        try {
            const registerData: RegisterLotDTO = {
                productId: selectedProductId,
                lotNumber: UUID(),
                suplierId: data.suplierId? BigInt(data.suplierId): null,
                purchasePrice: data.purchasePrice,
                initialQuantity: data.initialQuantity,
                purchaseUnit: data.purchaseUnit,
                receivedDate: new Date(formatDateForInput(data.receivedDate)),
                expirationDate: data.expirationDate ? new Date(formatDateForInput(data.expirationDate)) : null,
                manufacturingDate: data.manufacturingDate ? new Date(formatDateForInput(data.manufacturingDate)) : null
            }

            const result = await registerLotWithInventoryItemAction(registerData, BigInt(data.inventoryItemId ?? 0));

            if (result.ok) {
                setFloatMessageState({
                    summary: '¡Correcto!',
                    isActive: true,
                    type: 'green',
                    description: '¡Lote registrado exitosamente!'
                });

                setTimeout(() => {
                    setFloatMessageState({});
                    handleCloseModal();
                }, 2000);
            } else {
                const errorMessage = Array.isArray(result?.error) 
                    ? result.error.join(', ') 
                    : result?.error?.message || 'Error al registrar el lote';
                
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
        } catch (error) {
            setFloatMessageState({
                description: 'Error inesperado al registrar el lote',
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
        openModal,
        selectedProductId,
        handleOpenRegisterLotModal,
        handleCloseRegisterLotModal: handleCloseModal,
        // Form functions
        register,
        handleSubmit,
        reset,
        setValue,
        watch,
        clearErrors,
        errors,
        resetFormRegisterLot,
        onSubmit,
        // UI states
        floatMessageState,
        isLoading
    }
}

export { useRegisterLotModal };
