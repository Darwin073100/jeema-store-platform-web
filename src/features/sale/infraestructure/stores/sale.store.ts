import { create } from "zustand"
import { SaleEntity } from "../../domain/entities/sale-entity"

type State = {
    saleId: bigint
    setSaleId: (saleId: bigint)=> void,
    resetSaleId: ()=> void,
    sale: SaleEntity| null,
    setSale:(sale: SaleEntity|null)=> void,
    resetSale:()=> void,
    total: number,
    setTotal: (total: number)=> void,
    productQuantity: number,
    setProductQuantity: (total: number)=> void,
    resetSaleStore: ()=> void,
}

const initialValues = {
    saleId: BigInt(0),
    sale: null,
    total: 0,
}

export const useSaleStore = create<State>()((set, get)=>({
    ...initialValues,
    productQuantity: 0,
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
    setProductQuantity: (quantity: number)=>{
        set(()=>({
            productQuantity: quantity
        }));
    },
    resetSaleStore: ()=> {
        set(initialValues);
    }
}));