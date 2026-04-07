import * as yup from 'yup';
import { updateUserAction } from "@/contexts/authentication-management/auth/presentation/actions/update-user.action";
import { useEmployeeUIStore } from "../../stores/employee-ui.store";
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { useState } from 'react';

const schema = yup.object().shape({
    password: yup.string().trim().required('La contraseña es obligatoria.')
            .min(8,'La contraseña debe tener al menos 8 caracteres.')
            .typeError('Asegurate de ingresar la información correcta.'),
    passwordConfirm: yup.string().trim().required('Debes confirmar tu contraseña.')
            .oneOf([yup.ref('password')], 'Las contraseñas no coindicen.')
            .typeError('Asegurate de ingresar la información correcta.'),
});

type FormData = yup.InferType<typeof schema>;

const useResetUser = () => {
    const [userId, setUserId] = useState(BigInt(0));
    const { 
        loading, runLoading, stopLoading, setFloatMessageState, closeEmployeeModal, openEmployeeModal, employeeModal,
    } = useEmployeeUIStore();
    const { register, handleSubmit, reset, setValue, watch, clearErrors, formState: { errors } } = useForm({
        resolver: yupResolver(schema),
        mode: 'onChange',
        defaultValues: {
        }
    });

    const handleResetForm = ()=> {
        reset({
            password: undefined, passwordConfirm: undefined
        });
    }

    const onSubmit = async(data: FormData)=> {
        runLoading('resetPassword');
        const result = await updateUserAction(userId, {passwordPlain: data.password});
        stopLoading();
        if(result.ok){
            setFloatMessageState({
                type: 'green',
                isActive: true,
                summary: '¡Correcto!',
                description: `Contraseña restablecida 🫣.`
            });
            handleResetForm();
            closeEmployeeModal();
            setTimeout(()=>{
                setFloatMessageState({});
            }, 2000);
        } else {
            setFloatMessageState({
                type: 'red',
                isActive: true,
                summary: `${result.error?.statusCode}: ¡Error!`,
                description: result.error?.message ?? `No se pudo restablecer la contraseña 🫥.`
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
        setUserId,
        employeeModal,
    }
}

export { useResetUser };
