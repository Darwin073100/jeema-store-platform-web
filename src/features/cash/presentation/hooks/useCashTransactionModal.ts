'use client'
import { TransactionTypeEntity } from '@/features/transaction/domain/entities/transaction-type.entity';
import { SelectMenuOption } from '@/shared/ui/components/inputs';

const useCashTransactionModal = () => {
    const handleTransactionsTypeInput = (transactionsTypes: TransactionTypeEntity[])=> {
        const options:SelectMenuOption[] = transactionsTypes.map(item => ({
            value: item.transactionTypeId.toString(),
            text: item.name,
            additional: item.accountType.toUpperCase()
        }));
        return options;
    }
    return {
        handleTransactionsTypeInput
    }
}

export { useCashTransactionModal };
