import { create } from "zustand";
import { ProductEntity } from "../../domain/entities/product.entity";

type State = {
    deleteOpenModal: boolean,
    handleTrueDeleteOpenModal: ()=> void,
    handleFalseDeleteOpenModal: ()=> void,
    product: ProductEntity |null,
    setProduct: (product: ProductEntity|null)=> void,
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