import * as yup from 'yup';
import { useCashUIStore } from '../stores/cash-ui.store';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useCashStore } from '../stores/cash.store';
import { updateCashRegisterAction } from '../../../cash-register/presentation/actions/update-cash-register.action';
import { ICashRegister } from '@/contexts/cash-management/cash-register/presentation/interfaces/ICashRegister';

const schema = yup.object().shape({
    name: yup.string()
        .required('El nombre es obligatorio.')
        .min(3, 'El nombre debe tener mínimo 3 caracteres.')
        .max(150, 'El nombre debe tener máximo 150 caracteres.')
        .typeError('Asegurate de ingresar la información correcta.'),
});

type FormData = yup.InferType<typeof schema>;

const useUpdateCashRegister = () => {
    const { floatMessageState, setFloatMessageState, loading, runLoading, stopLoading, closeCashModal, openCashModal } = useCashUIStore();
    const { cashRegisterSelected, setCashRegisterSelected } = useCashStore();
    const { register, handleSubmit, reset, setValue, watch, clearErrors, formState: { errors } } = useForm({
        resolver: yupResolver(schema),
        mode: 'onChange',
        defaultValues: {
        }
    });

    const handleOpenEditCashRegisterModal = (cashRegister: ICashRegister) => {
        setCashRegisterSelected(cashRegister);
        reset({ name: cashRegister.name });
        openCashModal('editCashRegister');
    }

    const onSubmit = async (data: FormData) => {
        runLoading('updateCashRegister');
        const result = await updateCashRegisterAction(cashRegisterSelected?.cashRegisterId ?? BigInt(0), data.name);
        stopLoading();
        if(result.ok){
            setFloatMessageState({
                summary: '¡Correcto!',
                description: `Has editado ${cashRegisterSelected?.name} 😉.`,
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
        handleOpenEditCashRegisterModal,
    }
}

export { useUpdateCashRegister };
