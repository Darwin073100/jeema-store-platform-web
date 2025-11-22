import * as yup from 'yup';
import { useCashUIStore } from '../../infraestructure/stores/cash-ui.store';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { registerCashRegisterAction } from '../../actions/register-cash-register.action';
import { useCashStore } from '../../infraestructure/stores/cash.store';
import { CashRegisterEntity } from '../../domain/entities/cash-register.entity';
import { openCashSessionAction } from '../../actions/open-cash-session.action';
import { OpenCashSessionDTO } from '../../application/dtos/open-cash-session.dto';
import { formatDateForInput } from '@/shared/lib/utils/date-formatter';
import { numberMoneyFormat } from '@/shared/lib/utils/number-formatter';

const schema = yup.object().shape({
    startBalance: yup.number()
        .required('El monto es obligatorio')
        .positive('El monto debe ser positivo')
        .typeError('Asegurate de ingresar la información correcta.'),
});

type FormData = yup.InferType<typeof schema>;

const useOpenCashSession = () => {
    const { floatMessageState, setFloatMessageState, loading, runLoading, stopLoading, closeCashModal, openCashModal} = useCashUIStore();
    const { cashRegisterSelected, setCashRegisterSelected } = useCashStore();
    const { register, handleSubmit, reset, setValue, watch, clearErrors, formState: { errors } } = useForm({
        resolver: yupResolver(schema),
        mode: 'onChange',
        defaultValues: {
        }
    });

    const handleOpenOpenCasSessionModal = (cashRegister: CashRegisterEntity)=>{
        setCashRegisterSelected(cashRegister);
        openCashModal('openCashSession');
    }

    const onSubmit = async (data: FormData) => {
        runLoading('openCashSession');
        const dto = {
            cashRegisterId: cashRegisterSelected?.cashRegisterId ?? BigInt(0),
            startBalance: data.startBalance,
            startTime: new Date(formatDateForInput(new Date()))
        }
        const result = await openCashSessionAction(dto);
        stopLoading();
        if(result.ok){            
            setFloatMessageState({
                summary: '¡Correcto!',
                description: `Has aperturado ${cashRegisterSelected?.name} con ${numberMoneyFormat(dto.startBalance)} 😉.`,
                isActive: true,
                type: 'green'  
            });
            closeCashModal();
            setTimeout(()=>{
                setFloatMessageState({});
            }, 3500);
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
        handleOpenOpenCasSessionModal,
    }
}

export { useOpenCashSession };
