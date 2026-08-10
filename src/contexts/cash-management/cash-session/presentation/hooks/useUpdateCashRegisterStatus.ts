import { useCashUIStore } from '../stores/cash-ui.store';
import { useCashStore } from '../stores/cash.store';
import { activateCashRegisterAction } from '../../../cash-register/presentation/actions/activate-cash-register.action';
import { deactivateCashRegisterAction } from '../../../cash-register/presentation/actions/deactivate-cash-register.action';
import { ICashRegister } from '@/contexts/cash-management/cash-register/presentation/interfaces/ICashRegister';

const useUpdateCashRegisterStatus = () => {
    const { floatMessageState, setFloatMessageState, loading, runLoading, stopLoading, closeCashModal, openCashModal } = useCashUIStore();
    const { cashRegisterSelected, setCashRegisterSelected } = useCashStore();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const showResult = (result: any, successDescription: string) => {
        if(result.ok){
            setFloatMessageState({
                summary: '¡Correcto!',
                description: successDescription,
                isActive: true,
                type: 'green'
            });
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

    const handleActivate = async (cashRegister: ICashRegister) => {
        runLoading('activateCashRegister');
        const result = await activateCashRegisterAction(cashRegister.cashRegisterId);
        stopLoading();
        showResult(result, `Has activado ${cashRegister.name} 😉.`);
    }

    const handleOpenDeactivateConfirm = (cashRegister: ICashRegister) => {
        setCashRegisterSelected(cashRegister);
        openCashModal('deactivateCashRegister');
    }

    const handleConfirmDeactivate = async () => {
        if(!cashRegisterSelected){
            return;
        }
        runLoading('deactivateCashRegister');
        const result = await deactivateCashRegisterAction(cashRegisterSelected.cashRegisterId);
        stopLoading();
        showResult(result, `Has desactivado ${cashRegisterSelected.name} 😉.`);
        if(result.ok){
            closeCashModal();
        }
    }

    return {
        floatMessageState,
        loading,
        handleActivate,
        handleOpenDeactivateConfirm,
        handleConfirmDeactivate,
    }
}

export { useUpdateCashRegisterStatus };
