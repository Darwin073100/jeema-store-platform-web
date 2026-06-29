import { AccountTypeEnum } from "@/contexts/transaction-management/transaction-type/domain/enums/account-type.enum";
import { useCashStore } from "../stores/cash.store";

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

    const handleTotalInWithClose = ()=> {
        let total: number = 0;
        cashSessionSelected?.transactions.forEach(item=> {
            if(item.transactionType?.accountType===AccountTypeEnum.INCOME){
                if(item.transactionType?.name.trim().toLowerCase() === 'Apertura de Caja'.trim().toLowerCase()){
                    return;
                }
                if(item.transactionType?.name.trim().toLowerCase() === 'Aumento de efectivo en caja'.trim().toLowerCase()){
                    return;
                }
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
                // total = total + item.amount;
            }
            if(item.transactionType?.name.trim().toLowerCase() === 'Retiro de efectivo/Corte de caja'.trim().toLowerCase()){
                total = total - (item.amount);
            }
        });
        return total;
    }

    const handleTotalClose = ()=> {
        const total = handleTotalInWithClose() - handleTotalOut();
        if(total <= 0){
            return 0;
        }
        return total;
    }

    const handleBalanceFinaly = ()=> {
        let total = handleTotalIn() - handleTotalOut();
        if(total >= (cashSessionSelected?.startBalance ?? 0)){
            total = cashSessionSelected?.startBalance ?? 0;
        }
        cashSessionSelected?.transactions.forEach(item=> {
            if(item.transactionType?.accountType===AccountTypeEnum.INCOME){
                if(item.transactionType?.name.trim().toLowerCase() === 'Aumento de efectivo en caja'.trim().toLowerCase()){
                    total = total + item.amount;
                }
            }
        });
        return total;
    }
    return {
        handleTotalIn,
        handleTotalOut,
        handleTotalClose,
        handleBalanceFinaly,
    }
}

export { useCashInformation };