'use client';
import * as yup from 'yup';
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { useEffect } from 'react';
import { EstablishmentDetailTypeEnum } from '@/contexts/establishment-management/establishment-detail/domain/enums/establishment-detail-type.enum';
import { useEstablishmentDetailUIStore } from '../stores/establishment-detail-ui.store';
import { addEstablishmentDetailAction } from '../actions/add-establishment-detail.action';
import { updateEstablishmentDetailAction } from '../actions/update-establishment-detail.action';

export const schema = yup.object().shape({
    type: yup.mixed<EstablishmentDetailTypeEnum>()
        .oneOf(Object.values(EstablishmentDetailTypeEnum), 'Selecciona un tipo válido.')
        .required('El tipo es obligatorio.'),
    value: yup.string()
        .required('El valor es obligatorio.')
        .max(250, 'El valor debe tener máximo 250 caracteres.')
        .typeError('Asegurate de ingresar la información correcta.'),
});

type FormData = yup.InferType<typeof schema>;

const useEstablishmentDetailForm = (establishmentId: bigint) => {
    const {
        isModalOpen,
        mode,
        editingDetail,
        forcedType,
        loading,
        initLoading,
        stopLoading,
        floatMessageState,
        setFloatMessageState,
        closeModal,
    } = useEstablishmentDetailUIStore();

    const { register, handleSubmit, reset, watch, formState: { errors } } = useForm({
        resolver: yupResolver(schema),
        mode: 'onChange',
    });

    useEffect(() => {
        if (!isModalOpen) return;
        if (mode === 'edit' && editingDetail) {
            reset({ type: editingDetail.type, value: editingDetail.value });
        } else {
            reset({ type: forcedType ?? undefined, value: '' });
        }
    }, [isModalOpen, mode, editingDetail, forcedType]);

    const onSubmit = async (data: FormData) => {
        initLoading('save-establishment-detail');

        const result = mode === 'edit' && editingDetail
            ? await updateEstablishmentDetailAction(editingDetail.establishmentDetailId, data.value)
            : await addEstablishmentDetailAction(establishmentId, data.type as EstablishmentDetailTypeEnum, data.value);

        stopLoading();

        if (result.ok) {
            setFloatMessageState({
                summary: '¡Correcto!',
                description: mode === 'edit'
                    ? 'Dato de contacto actualizado correctamente 😉.'
                    : 'Dato de contacto agregado correctamente 😉.',
                isActive: true,
                type: 'green'
            });
            closeModal();
            setTimeout(() => {
                setFloatMessageState({});
            }, 2500);
        } else {
            setFloatMessageState({
                summary: `${result.error?.statusCode}: ¡Error!`,
                description: `${result.error?.message} 😢.`,
                isActive: true,
                type: 'red'
            });
            setTimeout(() => {
                setFloatMessageState({});
            }, 4000);
        }
    }

    return {
        onSubmit,
        handleSubmit,
        register,
        errors,
        watch,
        floatMessageState,
        loading,
        isModalOpen,
        mode,
        editingDetail,
        forcedType,
        closeModal,
    }
}

export { useEstablishmentDetailForm };
