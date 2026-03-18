'use client'
import { useEffect, useState } from 'react';
import { useSaveLotUnitPurchaseStore } from '../infraestructure/store/save-lot-unit-purchase.store';
import * as yup from 'yup';
import { FloatMessageType } from '@/shared/ui/types/FloatMessageType';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { AddLotUnitPurchaseDTO } from '../application/dtos/add-lot-unit-purchase.dto';
import { registerLotUniPurchaseAction } from '../actions/register-lot-unit-purchase.action';
import { ForSaleEnum } from '@/shared/domain/enums/for-sale.enum';

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

const useRegisterLotUnitPurchaseModal = () => {
    const {saveIsOpenModal, handleOpenSaveIsOpenModal, handlecloseSaveIsOpenModal, 
        lotUnitPurchase, setSelectedLotId, selectedLotId} = useSaveLotUnitPurchaseStore();

    const [floatMessageState, setFloatMessageState] = useState<FloatMessageType>({});
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const {register, handleSubmit, reset, setValue, watch, clearErrors, formState: {errors}} = useForm<RegisterFormData>({
        resolver: yupResolver(registerSchema) as any,
        mode: 'onChange'
    });

    useEffect(()=>{
        if(selectedLotId  && saveIsOpenModal){
            reset({
                purchasePrice: 0,
                purchaseQuantity: 0,
                unit: ForSaleEnum.PC,
                unitsInPurchaseUnit: 0
            })
        }
    },[saveIsOpenModal, reset, selectedLotId]);

    const resetFormRegisterLotUnitPurchase = ()=> {
        setSelectedLotId(null);
        reset({
            purchasePrice: 0,
            purchaseQuantity: 0,
            unit: ForSaleEnum.PC,
            unitsInPurchaseUnit: 0
        })
        clearErrors([
            'purchasePrice', 'purchaseQuantity', 'unit', 'unitsInPurchaseUnit'
        ]);

        setFloatMessageState({});
    }

    const handleSelectedLotUnitPurchase = (lotId: bigint)=>{
        setSelectedLotId(lotId);
        handleOpenSaveIsOpenModal();
    }

    const onSubmit = async (data: RegisterFormData)=>{
        setFloatMessageState({});
        setIsLoading(true);

        try{
            const addLotUnitPurchase: AddLotUnitPurchaseDTO = {
                lotId: selectedLotId ?? BigInt(0),
                purchasePrice: data.purchasePrice,
                purchaseQuantity: data.purchaseQuantity,
                unitsInPurchaseUnit: data.unitsInPurchaseUnit,
                unit: data.unit
            }
            const result = await registerLotUniPurchaseAction(addLotUnitPurchase);

            if (result.ok) {
                setFloatMessageState({
                    summary: '¡Correcto!',
                    isActive: true,
                    type: 'green',
                    description: '¡Unidad del Lote registrada exitosamente!'
                });

                setTimeout(() => {
                    setFloatMessageState({});
                    handlecloseSaveIsOpenModal();
                }, 3000);
            } else {
                const errorMessage = Array.isArray(result?.error) 
                    ? result.error.join(', ') 
                    : result?.error?.message || 'Error al registrar la unidad';
                
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
        saveIsOpenModal, 
        handleOpenSaveIsOpenModal, 
        handleSelectedLotUnitPurchase,
        handlecloseSaveIsOpenModal,
        register,
        handleSubmit,
        reset,
        setValue,
        watch,
        clearErrors,
        errors,
        resetFormRegisterLotUnitPurchase,
        onSubmit,
        // UI states
        floatMessageState,
        isLoading 
    }
}

export { useRegisterLotUnitPurchaseModal };
