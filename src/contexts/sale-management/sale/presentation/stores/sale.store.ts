import { create } from "zustand"
import { ISale } from "../interfaces/ISale";
import { ICashSession } from "@/contexts/cash-management/cash-session/presentation/interfaces/ICashSession";

type State = {
    sales: ISale[],
    setSales: (payload: ISale[])=> void,
    saleId: bigint
    setSaleId: (saleId: bigint)=> void,
    resetSaleId: ()=> void,
    sale: ISale| null,
    setSale:(sale: ISale|null)=> void,
    resetSale:()=> void,
    total: number,
    setTotal: (total: number)=> void,
    cashSessionActive: ICashSession | null,
    setCashSessionActive: (payload: ICashSession | null)=> void,
    resetSaleStore: ()=> void,
}

const initialValues = {
    saleId: BigInt(0),
    sale: null,
    total: 0,
    sales: [],
}

export const useSaleStore = create<State>()((set, get)=>({
    ...initialValues,
    setSales(payload) {
        set(()=>({
            sales: payload
        }))
    },
    cashSessionActive: null,
    setSaleId: (saleId: bigint)=> {
        set(()=>({
            saleId
        }));
    },
    resetSaleId: ()=> {
        set(()=>({
            saleId: BigInt(0)
        }));
    },
    resetSale: ()=> {
        set(()=>({sale: null}))
    },
    setSale: (sale: ISale| null)=>{
        set(()=>({
            sale
        }))
    },
    setTotal: (total: number) => {
        set(()=>({
            total
        }))
    },
    setCashSessionActive: (payload: ICashSession | null)=> {
        set(()=>({
            cashSessionActive: payload
        }));
    },
    resetSaleStore: ()=> {
        set(initialValues);
    }
}));