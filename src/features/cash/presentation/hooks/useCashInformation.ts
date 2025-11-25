import { AccountTypeEnum } from "@/features/transaction/domain/enums/account-type.enum";
import { useCashStore } from "../../infraestructure/stores/cash.store";

const useCashInformation = () => {
    const { cashSessionSelected } = useCashStore();
    const handleTotalIn = ()=> {
        let total: number = 0;
        cashSessionSelected?.transactions.forEach(item=> {
            if(item.transactionType?.accountType===AccountTypeEnum.INCOME){
                // if(item.transactionType?.name.trim().toLowerCase() === 'Apertura de Caja'.trim().toLowerCase()){
                //     return;
                // }
                total = total + item.amount;
            }
        });
        return total;
    }
    const handleTotalOut = ()=> {
        let total: number = 0;
        cashSessionSelected?.transactions.forEach(item=> {
            if(item.transactionType?.accountType===AccountTypeEnum.EXPENSE){
                total = total + item.amount;
            }
            if(item.transactionType?.name.trim().toLowerCase() === 'Apertura de Caja'.trim().toLowerCase()){
                total = total + item.amount;
            }
            if(item.transactionType?.name.trim().toLowerCase() === 'Retiro de efectivo/Corte de caja'.trim().toLowerCase()){
                total = total - (item.amount);
            }
        });
        return total;
    }

    const handleTotalClose = ()=> {
        const total = handleTotalIn() - handleTotalOut();
        return total;
    }
    return {
        handleTotalIn,
        handleTotalOut,
        handleTotalClose,
    }
}

export { useCashInformation };