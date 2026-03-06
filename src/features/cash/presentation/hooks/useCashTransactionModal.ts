'use client'
import * as yup from 'yup';
import { TransactionTypeEntity } from '@/features/transaction/domain/entities/transaction-type.entity';
import { SelectMenuOption } from '@/shared/ui/components/inputs';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { useCashUIStore } from '../../infraestructure/stores/cash-ui.store';
import { registerTransactionAction } from '@/features/transaction/actions/register-transaction.action';
import { useCashStore } from '../../infraestructure/stores/cash.store';

const schema = yup.object().shape({
    amount: yup.number()
        .required('El monto es obligatorio')
        .positive('El monto debe ser positivo')
        .typeError('Asegurate de ingresar la información correcta.'),
    description: yup.string().trim()
        .notRequired()
        .typeError('Asegurate de ingresar la información correcta.'),
    transactionTypeId: yup.string().trim()
        .required('Asegurate de seleccionar una opción')
        .typeError('Asegurate de ingresar la información correcta.'),
});

type FormData = yup.InferType<typeof schema>;

const useCashTransactionModal = () => {
    const { loading, runLoading, stopLoading, floatMessageState, setFloatMessageState, openCashModal, closeCashModal} = useCashUIStore();
    const { cashSessionSelected } = useCashStore();
    const handleTransactionsTypeInput = (transactionsTypes: TransactionTypeEntity[])=> {
        const options:SelectMenuOption[] = transactionsTypes
            .filter(item => item.name !== 'Ingreso por Venta de Mercancía')
            .filter(item => item.name !== 'Apertura de Caja')
            .filter(item => item.name !== 'Devolución por Venta al Cliente')
            .filter(item => item.name !== 'Ingreso por Sobrante en caja')
            .map(item => ({
                value: item.transactionTypeId.toString(),
                text: `${item.accountType.toUpperCase()} - ${item.name.toUpperCase()}`,
                additional: item.accountType.toUpperCase()
            })
        );
        return options;
    }
    const { register, handleSubmit, reset, setValue, watch, clearErrors, formState: { errors } } = useForm({
        resolver: yupResolver(schema),
        mode: 'onChange',
        defaultValues: {
        }
    });
    
    const onSubmit = async (data: FormData) => {
            runLoading('cashTransaction');
            const result = await registerTransactionAction({
                amount: data.amount, 
                cashSessionId: BigInt(cashSessionSelected?.cashSessionId ?? 0), 
                description: data.description ?? null, 
                transactionTypeId: BigInt(data.transactionTypeId), 
                purchaseId: null, 
                saleId: null});
            stopLoading();
            if(result.ok){            
                setFloatMessageState({
                    summary: '¡Correcto!',
                    description: `Movimiento registrado correctamente 😉.`,
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
        handleTransactionsTypeInput,
    }
}

export { useCashTransactionModal };
