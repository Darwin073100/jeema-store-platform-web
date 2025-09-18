import { create } from "zustand"
import { SaleEntity } from "../../domain/entities/sale-entity"

type State = {
    saleId: bigint
    setSaleId: (saleId: bigint)=> void,
    resetSaleId: ()=> void,
    sale: SaleEntity| null,
    setSale:(sale: SaleEntity|null)=> void,
    resetSale:()=> void,
}

export const useSaleStore = create<State>()((set, get)=>({
    saleId: BigInt(0),
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
    sale: null,
    resetSale: ()=> {
        set(()=>({sale: null}))
    },
    setSale: (sale: SaleEntity| null)=>{
        set(()=>({
            sale
        }))
    }
}));