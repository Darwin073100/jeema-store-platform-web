import * as yup from 'yup';
import { useCashUIStore } from '../../infraestructure/stores/cash-ui.store';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useCashStore } from '../../infraestructure/stores/cash.store';
import { formatDateForInput } from '@/shared/lib/utils/date-formatter';
import { numberMoneyFormat } from '@/shared/lib/utils/number-formatter';
import { closeCashSessionAction } from '../../actions/close-cash-session.action';
import { useCashInformation } from './useCashInformation';
import { useEffect } from 'react';
import { TbKeyframeFilled } from 'react-icons/tb';

const schema = yup.object().shape({
    diference: yup.number()
        .transform((value, originalValue) => {
            // Convertir undefined, null o string vacío a 0 directamente en la validación
            if (originalValue === undefined || originalValue === null || originalValue === '') return null;
            return value;
        })
        .optional()
        .notRequired()
        .nullable()
        .typeError('Asegurate de ingresar la información correcta.'),
    closingNotes: yup.string()
        .trim()
        .optional()
        .notRequired()
        .typeError('Asegurate de ingresar la información correcta.'),
});

type FormData = yup.InferType<typeof schema>;

const useCashSessionClose = () => {
    const { 
        floatMessageState, setFloatMessageState, loading, runLoading, stopLoading, closeCashModal, openCashModal
    } = useCashUIStore();
    const { cashRegisterSelected, cashSessionSelected  } = useCashStore();
    const { handleTotalClose } = useCashInformation();
    const { register, handleSubmit, reset, setValue, watch, clearErrors, formState: { errors } } = useForm({
        resolver: yupResolver(schema),
        mode: 'onChange',
        defaultValues: {
        }
    });

    const onSubmit = async (data: FormData) => {
        runLoading('closeCashSession');
        
        const cashSessionId = cashSessionSelected?.cashSessionId ?? BigInt(0);

        const dto = {
            expectedBalance: handleTotalClose(),
            diference: data.diference ?? 0,
            actualBalance: (handleTotalClose() + (data.diference ?? 0)),
            endTime: new Date(formatDateForInput(new Date())),
            closingNotes: data.closingNotes ?? null,
        }
        const result = await closeCashSessionAction(cashSessionId, dto);
        stopLoading();
        if(result.ok){            
            setFloatMessageState({
                summary: '¡Correcto!',
                description: `Has hecho el corte de ${cashRegisterSelected?.name} con ${numberMoneyFormat(dto.actualBalance)} 😉.`,
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
    }
}

export { useCashSessionClose };
