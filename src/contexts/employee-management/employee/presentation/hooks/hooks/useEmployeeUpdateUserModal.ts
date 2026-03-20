import * as yup from 'yup';
import { updateUserAction } from "@/features/auth/actions/update-user.action";
import { useEmployeeUIStore } from "../../stores/employee-ui.store";
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { useEmployeeStore } from '../../stores/employee-store';

const schema = yup.object().shape({
    userUsername: yup.string().trim()
        .required('La campo nombre de usuario es obligatorio.')
        .min(3, 'Mínimo 3 caracteres debes escribir')
        .typeError('Asegurate de ingresar la información correcta.'),
    userEmail: yup.string().trim()
        .required('El campo correo es obligatorio.')
        .email('El formato para el correo es alberto@platform.com.mx')
        .typeError('Asegurate de ingresar la información correcta.'),
});

type FormData = yup.InferType<typeof schema>;

const useEmployeeUpdateUserModal = () => {
    const { employee } = useEmployeeStore();
    const { 
        loading, runLoading, stopLoading, setFloatMessageState, closeEmployeeModal, openEmployeeModal, employeeModal,
    } = useEmployeeUIStore();

    const { register, handleSubmit, reset, setValue, watch, clearErrors, formState: { errors } } = useForm({
        resolver: yupResolver(schema),
        mode: 'onChange',
        defaultValues: {
        }
    });

    useEffect(()=> {
        reset({userEmail: employee?.user?.email, userUsername: employee?.user?.username});
    },[employee, employeeModal]);

    const onSubmit = async(data: FormData)=> {
        runLoading('editUser');
        const result = await updateUserAction(employee?.user?.userId ?? BigInt(0), {email: data.userEmail, username: data.userUsername});
        stopLoading();
        if(result.ok){
            setFloatMessageState({
                type: 'green',
                isActive: true,
                summary: '¡Correcto!',
                description: `Información editada 🫣.`
            });
            closeEmployeeModal();
            setTimeout(()=>{
                setFloatMessageState({});
            }, 2000);
        } else {
            setFloatMessageState({
                type: 'red',
                isActive: true,
                summary: `${result.error?.statusCode}: ¡Error!`,
                description: result.error?.message ?? `No se pudo editar la información 🫥.`
            });
            setTimeout(()=>{
                setFloatMessageState({});
            }, 3500);
        }
    }

    return {
        closeEmployeeModal,
        openEmployeeModal,
        onSubmit,
        loading,
        handleSubmit,
        register,
        errors,
        employeeModal,
    }
}

export { useEmployeeUpdateUserModal };
