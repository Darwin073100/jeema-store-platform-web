import * as yup from 'yup';
import { ForSaleEnum } from "@/features/product/domain/enums/for-sale.enum";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { FloatMessageType } from "@/shared/ui/types/FloatMessageType";
import { RegisterLotDTO } from "../application/dtos/register-lot.dto";
import { registerLotAction } from "../actions/register-lot.action";
import { useRegisterLotModalStore } from "../infraestructure/store/register-lot-modal.store";

// Schema de validación Yup para registrar un lote
export const registerLotSchema = yup.object().shape({
    lotNumber: yup
        .string()
        .required('El número de lote es obligatorio.')
        .test('is-string', 'El número de lote debe ser una cadena de texto.', 
              value => typeof value === 'string'),

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

// Función auxiliar para formatear fechas para inputs tipo date
const formatDateForInput = (date: Date | string | null | undefined): string => {
    if (!date) return '';
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    if (isNaN(dateObj.getTime())) return '';
    return dateObj.toISOString().split('T')[0];
};

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
                lotNumber: '',
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
            lotNumber: '',
            purchasePrice: 0,
            initialQuantity: 0,
            purchaseUnit: ForSaleEnum.PC,
            expirationDate: '',
            manufacturingDate: '',
            receivedDate: '',
        });
        clearErrors(['lotNumber', 'purchasePrice', 'initialQuantity', 
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
                lotNumber: data.lotNumber,
                purchasePrice: data.purchasePrice,
                initialQuantity: data.initialQuantity,
                purchaseUnit: data.purchaseUnit,
                receivedDate: new Date(data.receivedDate),
                expirationDate: data.expirationDate ? new Date(data.expirationDate) : null,
                manufacturingDate: data.manufacturingDate ? new Date(data.manufacturingDate) : null
            }

            const result = await registerLotAction(registerData);

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
