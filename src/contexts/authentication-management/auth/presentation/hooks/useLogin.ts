import { FloatMessageType } from '@/shared/ui/types/FloatMessageType';
import { yupResolver } from '@hookform/resolvers/yup';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import * as yup from 'yup';
import { useAuth } from '@/shared/presentation/hooks/auth/useAuth';

const schema = yup.object({
    email: yup.string().required('El correo es obligatorio.').min(3, 'El correo debe tener al menos 3 caracteres.'),
    password: yup.string().required('La contraseña es obligatoria.').min(8, 'La contraseña debe tener al menos 8 caracteres.').max(20, 'La contraseña debe tener como máximo 20 caracteres.'),
}).required();

type FormData = yup.InferType<typeof schema>;

function useLogin() {
    const [floatMessageState, setFloatMessageState] = useState<FloatMessageType>({});
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuth();
    const router = useRouter();

    const { register, handleSubmit, reset, setValue, watch, clearErrors, formState: { errors } } = useForm({
        resolver: yupResolver(schema),
        mode: 'onChange',
        defaultValues: {
            email: '',
            password: ''
        }
    });

    const resetFormLogin = () => {
        reset({});
        clearErrors(['email', 'password']);
    }

    const onSubmit = async (data: FormData) => {
        setFloatMessageState(() => ({}));
        setIsLoading(true);

        try {
            // Usar el nuevo hook de autenticación con NextAuth
            const result = await login(data.email, data.password);

            if (result.success) {
                setIsLoading(false);
                resetFormLogin();
                setFloatMessageState(() => ({
                    description: 'Usuario autenticado correctamente',
                    summary: '¡Correcto!',
                    isActive: true,
                    type: 'green'
                }));
                
                // Redirigir al dashboard o página principal
                setTimeout(() => {
                    router.push('/');
                }, 1000);
            } else {
                setIsLoading(false);
                setFloatMessageState(() => ({
                    description: result.error || 'Ocurrió un error al iniciar sesión',
                    summary: '¡Error!',
                    isActive: true,
                    type: 'red'
                }));
                setTimeout(() => {
                    setFloatMessageState(() => ({}));
                }, 4000);
            }
        } catch (error) {
            setIsLoading(false);
            setFloatMessageState(() => ({
                description: 'Error inesperado al iniciar sesión',
                summary: '¡Error!',
                isActive: true,
                type: 'red'
            }));
            setTimeout(() => {
                setFloatMessageState(() => ({}));
            }, 4000);
        }
    }

    return {
        register,
        handleSubmit,
        reset,
        setValue,
        watch,
        clearErrors,
        onSubmit,
        errors,
        isLoading,
        floatMessageState
    }
}

export { useLogin };