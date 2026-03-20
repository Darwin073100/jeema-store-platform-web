'use client';
import * as yup from 'yup';
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { useEffect } from 'react';
import { useEstablishmentNoStorageStore } from '../stores/establishment-no-storage.store';
import { useEstablishmentUIStore } from '../stores/establishment-ui.store';
import { updateEstablishmentAction } from '../actions/update-establishment.action';

export const schema = yup.object().shape({
    name: yup.string()
        .required('El nombre es obligatorio.')
        .min(3, 'El nombre debe tener mínimo 3 caracteres.')
        .max(100, 'El nombre debe tener máximo 100 caracteres.')
        .typeError('Asegurate de ingresar la información correcta.')
});

type FormData = yup.InferType<typeof schema>;

const useEstablishmentUpdate = () => {
    const { establishment } = useEstablishmentNoStorageStore()
    const { floatMessageState, setFloatMessageState, loading, initLoading, stopLoading, establishmentModal, closeEstablishmentModal } = useEstablishmentUIStore();
    const { register, handleSubmit, reset, setValue, watch, clearErrors, formState: { errors } } = useForm({
        resolver: yupResolver(schema),
        mode: 'onChange',
    });

    useEffect(()=>{
        if(establishment){
            reset({
                name: establishment.name
            });
        }
    },[establishmentModal]);

    const onSubmit = async (data: FormData) => {
        initLoading('update-establishment');

        const result = await updateEstablishmentAction(data.name);
        stopLoading();
        if(result.ok){            
            setFloatMessageState({
                summary: '¡Correcto!',
                description: 'Información modificada correctamente 😉.',
                isActive: true,
                type: 'green'  
            });
            closeEstablishmentModal();
            setTimeout(()=>{
                setFloatMessageState({});
            }, 2500);
        } else {
            setFloatMessageState({
                summary: `${result.error?.statusCode}: ¡Error!`,
                description: `${result.error?.message} 😢.`,
                isActive: true,
                type: 'red'
            });
            setTimeout(()=>{
                setFloatMessageState({});
            }, 4000);
        }


    }
    return {
        onSubmit,
        handleSubmit,
        register,
        errors,
        floatMessageState,
        loading,
    }
}

export { useEstablishmentUpdate };