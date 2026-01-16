'use client'
import { useEffect, useState } from 'react';
import * as yup from 'yup';
import { FloatMessageType } from '@/shared/ui/types/FloatMessageType';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { ForSaleEnum } from '@/features/product/domain/enums/for-sale.enum';
import { useUpdateLotUnitPurchaseStore } from '../infraestructure/store/update-lot-unit-purchase.store';
import { LotUnitPurchaseEntity } from '../domain/entities/lot-unit-purchase.entity';
import { UpdateLotUnitPurchaseDTO } from '../application/dtos/update-lot-unit-purchase.dto';
import { updateLotUniPurchaseAction } from '../actions/update-lot-unit-purchase.action';

const registerSchema = yup.object().shape({
    purchasePrice: yup
        .number()
        .required('El precio de compra es obligatorio.')
        .positive('El precio debe ser positivo')
        .typeError('Asegurate de ingresar la información correcta.'),
    purchaseQuantity: yup
        .number()
        .required('La cantidad de compra es obligatoria.')
        .positive('La cantidad debe ser positiva')
        .typeError('Asegurate de ingresar la información correcta.'),
    unit: yup
        .mixed<ForSaleEnum>()
        .oneOf(Object.values(ForSaleEnum), 'La unidad de compra para la unidad debe ser un valor válido.')
        .required('La unidad de compra es obligatoria.')
        .typeError('Asegurate de ingresar la información correcta.'), 
    unitsInPurchaseUnit: yup
        .number()
        .required('Las unidades en la unidad de compra son requeridas')
        .positive('La cantidad debe ser positiva')
        .typeError('Asegurate de ingresar la información correcta.'),
});

export type RegisterFormData = yup.InferType<typeof registerSchema>;

const useUpdateLotUnitPurchaseModal = () => {
    const {updateIsOpenModal, handleUpdateOpenIsOpenModal, handlecloseUpdateIsOpenModal, 
        lotUnitPurchase, setLotUnitPurchase} = useUpdateLotUnitPurchaseStore();

    const [floatMessageState, setFloatMessageState] = useState<FloatMessageType>({});
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const {register, handleSubmit, reset, setValue, watch, clearErrors, formState: {errors}} = useForm<RegisterFormData>({
        resolver: yupResolver(registerSchema) as any,
        mode: 'onChange'
    });

    useEffect(()=>{
        if(lotUnitPurchase  && updateIsOpenModal){
            reset({
                purchasePrice: lotUnitPurchase.purchasePrice,
                purchaseQuantity: lotUnitPurchase.purchaseQuantity,
                unit: lotUnitPurchase.unit,
                unitsInPurchaseUnit: lotUnitPurchase.unitsInPurchaseUnit
            })
        }
    },[updateIsOpenModal, reset, lotUnitPurchase]);



    const handleSelectedLotUnitPurchase = (unit: LotUnitPurchaseEntity)=>{
        setLotUnitPurchase(unit)
        handleUpdateOpenIsOpenModal();
    }

    const onSubmit = async (data: RegisterFormData)=>{
        setFloatMessageState({});
        setIsLoading(true);

        try{
            const updateLotUnitPurchase: UpdateLotUnitPurchaseDTO = {
                lotUnitPurchaseId: lotUnitPurchase?.lotUnitPurchaseId ?? BigInt(0),
                lotId: lotUnitPurchase?.lotId ?? BigInt(0),
                purchasePrice: data.purchasePrice,
                purchaseQuantity: data.purchaseQuantity,
                unitsInPurchaseUnit: data.unitsInPurchaseUnit,
                unit: data.unit as ForSaleEnum
            }
            const result = await updateLotUniPurchaseAction(updateLotUnitPurchase);

            if (result.ok) {
                setFloatMessageState({
                    summary: '¡Correcto!',
                    isActive: true,
                    type: 'green',
                    description: '¡Unidad del Lote actualizada exitosamente!'
                });

                setTimeout(() => {
                    setFloatMessageState({});
                    handlecloseUpdateIsOpenModal();
                }, 3000);
            } else {
                const errorMessage = Array.isArray(result?.error) 
                    ? result.error.join(', ') 
                    : result?.error?.message || 'Error al actualizar la unidad';
                
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
                description: 'Error inesperado al registrar la unidad del lote',
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
        updateIsOpenModal, 
        handleUpdateOpenIsOpenModal, 
        handleSelectedLotUnitPurchase,
        handlecloseUpdateIsOpenModal,
        register,
        handleSubmit,
        reset,
        setValue,
        watch,
        clearErrors,
        errors,
        onSubmit,
        // UI states
        floatMessageState,
        isLoading 
    }
}

export { useUpdateLotUnitPurchaseModal };
