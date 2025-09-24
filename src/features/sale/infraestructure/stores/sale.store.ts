import { create } from "zustand"
import { SaleEntity } from "../../domain/entities/sale-entity"
import { SaleDetailEntity } from "../../domain/entities/sale-detail-entity"

type State = {
    detailSelected: SaleDetailEntity | null,
    setDetailSelected: ( payload: SaleDetailEntity | null)=> void,
    modalDeleteDetail: boolean,
    openModalDeleteDetail: ()=> void,
    closeModalDeleteDetail: ()=> void,
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
    detailSelected: null,
    modalDeleteDetail: false,
    saleId: BigInt(0),
    sale: null,
    total: 0,
    productQuantity: 0,
}

export const useSaleStore = create<State>()((set, get)=>({
    ...initialValues,
    setSaleId: (saleId: bigint)=> {
        set(()=>({
            saleId
        }));
    },
    setDetailSelected: (payload: SaleDetailEntity | null)=>{
        set(()=>({ detailSelected: payload}));
    },
    closeModalDeleteDetail: ()=>{
        set(()=>({ modalDeleteDetail: false}));
    },
    openModalDeleteDetail: ()=> {
        set(()=>({ modalDeleteDetail: true}));
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