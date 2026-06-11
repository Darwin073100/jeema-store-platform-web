import { create } from "zustand";
import { ITransaction } from "../interfaces/ITransaction";

type State = {
    searchCharacter: string,
    setSearchCharacter: (payload: string)=> void,
    transactions: ITransaction[]|[],
    transactionsFiltered: ITransaction[]|[],
    setTransactions: (value: ITransaction[])=> void,
    setTransactionsFiltered: (value: ITransaction[])=> void,
    transaction: ITransaction|null,
    setTransaction: (payload: ITransaction|null)=> void,
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