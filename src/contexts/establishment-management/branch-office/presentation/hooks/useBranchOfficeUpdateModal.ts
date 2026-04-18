'use client';
import * as yup from 'yup';
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useBranchOfficeStore } from '../stores/branch-office.store';
import { useBranchOfficeUIStore } from '../stores/branch-office-ui.store';
import { UpdateBranchOfficeDto } from '../../application/dtos/update-branch-office.dto';
import { UpdateBranchOfficeAction } from '../actions/update-branch-office.action';

export const schema = yup.object().shape({
    name: yup.string().trim()
        .required('El nombre de la sucursal es obligatorio')
        .typeError('Asegurate de ingresar la información correcta.'),
});

type FormData = yup.InferType<typeof schema>;

const useBranchOfficeUpdateModal = () => {
    const { branchOffice } = useBranchOfficeStore();
    const { 
        floatMessageState, setFloatMessageState, loading, runLoading, stopLoading, branchOfficeModal, closeBranchOfficeModal 
    } = useBranchOfficeUIStore();
    const { register, handleSubmit, reset, watch, formState: { errors } } = useForm({
        resolver: yupResolver(schema),
        mode: 'onChange',
        defaultValues: {
        }
    });

    const handleResetForm = () => {
        reset({
            name: branchOffice?.name ?? '', 
        });
    }

    useEffect(()=> {
        if(branchOfficeModal==='editBranchOffice'){
            handleResetForm();
        }
    }, [branchOfficeModal]);

    const onSubmit = async (data: FormData) => {
        runLoading('editBranchOffice');

        const dto: UpdateBranchOfficeDto = {
            branchOfficeId: branchOffice?.branchOfficeId ?? BigInt(0),
            name: data.name
        }

        const result = await UpdateBranchOfficeAction(dto);
        stopLoading();

        if (result.ok) {
            closeBranchOfficeModal();
            setFloatMessageState({
                summary: '¡Correcto!',
                description: 'Datos guardados correctamente',
                isActive: true,
                type: 'green'
            });
            setTimeout(() => {
                setFloatMessageState({});
            }, 3000);
        } else {
            setFloatMessageState({
                summary: `${result.error?.statusCode}: ¡Error!`,
                description: result.error?.message,
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
        floatMessageState,
        loading,
    }
}

export { useBranchOfficeUpdateModal };