import { create } from "zustand"
import { SaleEntity } from "../../domain/entities/sale-entity"
import { CashSessionEntity } from "@/features/cash/domain/entities/cash-session.entity"

type State = {
    saleId: bigint
    setSaleId: (saleId: bigint)=> void,
    resetSaleId: ()=> void,
    sale: SaleEntity| null,
    setSale:(sale: SaleEntity|null)=> void,
    resetSale:()=> void,
    total: number,
    setTotal: (total: number)=> void,
    cashSessionActive: CashSessionEntity | null,
    setCashSessionActive: (payload: CashSessionEntity | null)=> void,
    resetSaleStore: ()=> void,
}

const initialValues = {
    saleId: BigInt(0),
    sale: null,
    total: 0,
    cashSessionActive: null,
}

export const useSaleStore = create<State>()((set, get)=>({
    ...initialValues,
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
    setSale: (sale: SaleEntity| null)=>{
        set(()=>({
            sale
        }))
    },
    setTotal: (total: number) => {
        set(()=>({
            total
        }))
    },
    setCashSessionActive: (payload: CashSessionEntity | null)=> {
        set(()=>({
            cashSessionActive: payload
        }));
    },
    resetSaleStore: ()=> {
        set(initialValues);
    }
}));