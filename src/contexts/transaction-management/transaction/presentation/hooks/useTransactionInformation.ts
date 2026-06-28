import { AccountTypeEnum } from "@/contexts/transaction-management/transaction-type/domain/enums/account-type.enum";
import { useTransactionStore } from "../stores/transaction.store";

export function useTransactionInformation() {
    const { transactionsFiltered} = useTransactionStore();
    const incomes = ()=> {
        let total = 0;
        transactionsFiltered
            .forEach(item => {
                if(
                    item.transactionType?.accountType === AccountTypeEnum.INCOME &&
                    (item.transactionType?.name.toLowerCase() !== 'Apertura de Caja'.toLowerCase() &&
                    item.transactionType?.name.toLowerCase() !== 'Aumento de efectivo en caja'.toLowerCase())
                ){
                    total = total + item.amount;
                }
            });
            return total;
    }

    const expenses = ()=> {
        let total = 0;
        transactionsFiltered
            .forEach(item => {
                if(
                    item.transactionType?.accountType === AccountTypeEnum.EXPENSE &&
                    item.transactionType?.name.toLowerCase() !== 'Retiro de efectivo/Corte de caja'.toLowerCase()
                ){
                    total = total + item.amount;
                }
            });
            return total;
    }

    return {
        incomes,
        expenses
    }
}