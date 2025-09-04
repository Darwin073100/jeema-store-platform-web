import { create } from "zustand";

type State = {
    deleteOpenModal: boolean,
    handleTrueDeleteOpenModal: ()=> void,
    handleFalseDeleteOpenModal: ()=> void,
    inventoryItemId: bigint|null,
    setInventoryItemId: (itemId: bigint|null)=> void,
}

export const useDeleteInventoryItemStore = create<State>()((set, get)=>({
    inventoryItemId: null,
    deleteOpenModal: false,
    setInventoryItemId(payload) {
        set(()=> ({inventoryItemId: payload}))
    },
    handleTrueDeleteOpenModal() {
        set(()=> ({deleteOpenModal: true}))
    },
    handleFalseDeleteOpenModal() {
        set(()=> ({deleteOpenModal: false}))
    },
}));