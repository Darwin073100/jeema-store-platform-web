import { create } from "zustand";
import { TransactionEntity } from "../../../../../features/transaction/domain/entities/transaction.entity";

type State = {
    searchCharacter: string,
    setSearchCharacter: (payload: string)=> void,
    transactions: TransactionEntity[]|[],
    transactionsFiltered: TransactionEntity[]|[],
    setTransactions: (value: TransactionEntity[])=> void,
    setTransactionsFiltered: (value: TransactionEntity[])=> void,
    transaction: TransactionEntity|null,
    setTransaction: (payload: TransactionEntity|null)=> void,
    openModal: boolean,
    setOpenModal: (value:boolean)=> void
};

export const useTransactionStore = create<State>()((set, get)=>({
    searchCharacter: "",
    setSearchCharacter: (payload)=>{
        set(()=>({searchCharacter: payload}));
    },
    transaction: null,
    transactions:[],
    transactionsFiltered:[],
    setTransactions(value) {
        set(()=> ({transactions: value}))
    },
    setTransactionsFiltered(value) {
        set(()=> ({transactionsFiltered: value}))
    },
    setTransaction: (payload)=> set(()=> ({transaction: payload})),
    openModal: false,
    setOpenModal(value) {
        set(()=> ({openModal: value}))
    },
}));