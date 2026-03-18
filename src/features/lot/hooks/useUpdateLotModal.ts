'use client'
import { useLotStore } from "../infraestructure/store/lot.store";
import * as yup from 'yup';
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { FloatMessageType } from "@/shared/ui/types/FloatMessageType";
import { UpdateLotDTO } from "../application/dtos/update-lot.dto";
import { updateLotAction } from "../actions/update-lot.action";
import { ILot } from "@/contexts/purchase-management/lot/presentation/interfaces/ILot";
import { ForSaleEnum } from "@/shared/domain/enums/for-sale.enum";

// Schema de validación Yup para actualizar un lote
export const updateLotSchema = yup.object().shape({
    purchasePrice: yup
        .number()
        .required('El precio de compra es obligatorio.')
        .test('max-decimals', 'El precio de compra debe ser un número con hasta 4 decimales.', 
              value => value === undefined || Number(value.toFixed(4)) === value),
    suplierId: yup
        .string()
        .optional()
        .default('0')
        .typeError(`Asegurate de ingresar la información correcta.`),
    initialQuantity: yup
        .number()
        .required('La cantidad inicial es obligatoria.')
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

export type FormData = yup.InferType<typeof updateLotSchema>;

// Función auxiliar para formatear fechas para inputs tipo date
const formatDateForInput = (date: Date | string | null | undefined): string => {
    if (!date) return '';
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    if (isNaN(dateObj.getTime())) return '';
    return dateObj.toISOString().split('T')[0];
};

const useUpdateLotModal = () => {
    const [floatMessageState, setFloatMessageState] = useState<FloatMessageType>({});
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const { lot, setLot, openModal, setOpenModal } = useLotStore();

    const { register, handleSubmit, reset, setValue, watch,clearErrors, formState: { errors } } = useForm<FormData>({
        resolver: yupResolver(updateLotSchema) as any,
        mode: 'onChange',
    });

    useEffect(() => {
        if (lot && openModal) {
            reset({
                suplierId: lot.suplierId? lot.suplierId.toString(): undefined, 
                purchasePrice: lot.purchasePrice,
                initialQuantity: lot.initialQuantity,
                purchaseUnit: lot.purchaseUnit,
                expirationDate: lot.expirationDate ? formatDateForInput(lot.expirationDate) : '',
                manufacturingDate: lot.manufacturingDate ? formatDateForInput(lot.manufacturingDate) : '',
                receivedDate: formatDateForInput(lot.receivedDate),
            });
        }
    }, [lot, openModal, reset]);
    const handleOpenUpdateLotModal = (lot: ILot) => {
        setLot(lot);
        setOpenModal(true);
    }

    const handleCloseUpdateLotModal = () => {
        setOpenModal(false);
    }

    const resetFormUpdateLot = () => {
        setLot(null);
        reset({
            expirationDate: '',
            initialQuantity: 0,
            manufacturingDate: '',
            purchasePrice: 0,
            receivedDate: '',
            purchaseUnit: ForSaleEnum.PC
        });
        clearErrors(['expirationDate', 'initialQuantity', 'manufacturingDate',
            'purchasePrice','purchaseUnit', 'receivedDate'
        ]);
        setFloatMessageState({});
    }

    const onSubmit = async (data: FormData)=>{
        if(!lot) return;

        setFloatMessageState({});
        setIsLoading(true);

        try {
            const updateData: UpdateLotDTO = {
                lotId: lot.lotId,
                suplierId: BigInt(data.suplierId),
                initialQuantity: data.initialQuantity,
                lotNumber: lot.lotNumber,
                productId: lot.productId,
                purchasePrice: data.purchasePrice,
                purchaseUnit: data.purchaseUnit,
                receivedDate: new Date(formatDateForInput(data.receivedDate)),
                expirationDate: data.expirationDate ? new Date(formatDateForInput(data.expirationDate)) : null,
                manufacturingDate: data.manufacturingDate ? new Date(formatDateForInput(data.manufacturingDate)) : null
            }

            const result = await updateLotAction(updateData);

            if(result.ok){
                setFloatMessageState({
                    summary: '¡Correcto!',
                    isActive: true,
                    type: 'green',
                    description: '¡Lote modificado exitosamente!'
                });

                setTimeout(() => {
                    setFloatMessageState({});
                    handleCloseUpdateLotModal();
                }, 2000);
            } else {
                const errorMessage = Array.isArray(result?.error) 
                    ? result.error.join(', ') 
                    : result?.error?.message || 'Error al actualizar el lote';
                
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
                description: 'Error inesperado al actualizar el producto',
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
        lot,
        setLot,
        openModal,
        handleOpenUpdateLotModal,
        handleCloseUpdateLotModal,
        // Form functions
        register,
        handleSubmit,
        reset,
        setValue,
        watch,
        clearErrors,
        errors,
        resetFormUpdateLot,
        onSubmit,
        // UI states
        floatMessageState,
        isLoading
    }
}

export { useUpdateLotModal };
