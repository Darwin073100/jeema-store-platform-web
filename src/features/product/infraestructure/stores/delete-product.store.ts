import { create } from "zustand";
import { IProduct } from "@/contexts/product-management/product/presentation/interfaces/IProduct";

type State = {
    deleteOpenModal: boolean,
    handleTrueDeleteOpenModal: ()=> void,
    handleFalseDeleteOpenModal: ()=> void,
    product: IProduct |null,
    setProduct: (product: IProduct|null)=> void,
}

export const useDeleteProductStore = create<State>()((set, get)=>({
    deleteOpenModal: false,
    product: null,
    setProduct(payload) {
        set(()=> ({product: payload}))
    },
    handleTrueDeleteOpenModal() {
        set(()=> ({deleteOpenModal: true}))
    },
    handleFalseDeleteOpenModal() {
        set(()=> ({deleteOpenModal: false}))
    },
}));