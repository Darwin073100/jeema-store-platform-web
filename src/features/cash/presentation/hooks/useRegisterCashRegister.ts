import * as yup from 'yup';
import { useCashUIStore } from '../../infraestructure/stores/cash-ui.store';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { registerCashRegisterAction } from '../../actions/register-cash-register.action';

const schema = yup.object().shape({
    name: yup.string()
        .required('El nombre es obligatorio.')
        .min(3, 'El nombre debe tener mínimo 3 caracteres.')
        .max(100, 'El nombre debe tener máximo 100 caracteres.')
        .typeError('Asegurate de ingresar la información correcta.'),
});

type FormData = yup.InferType<typeof schema>;

const useRegisterCashRegister = () => {
    const { floatMessageState, setFloatMessageState, loading, runLoading, stopLoading, closeCashModal} = useCashUIStore();
    const { register, handleSubmit, reset, setValue, watch, clearErrors, formState: { errors } } = useForm({
        resolver: yupResolver(schema),
        mode: 'onChange',
        defaultValues: {
        }
    });

    const onSubmit = async (data: FormData) => {
        runLoading('registerCashRegister');
        const result = await registerCashRegisterAction(data.name);
        stopLoading();
        if(result.ok){            
            setFloatMessageState({
                summary: '¡Correcto!',
                description: 'Has registrado una nueva caja 😉.',
                isActive: true,
                type: 'green'  
            });
            closeCashModal();
            setTimeout(()=>{
                setFloatMessageState({});
            }, 3000);
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

export { useRegisterCashRegister };
