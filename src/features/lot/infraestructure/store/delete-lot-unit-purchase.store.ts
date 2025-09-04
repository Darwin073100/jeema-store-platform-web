import { create } from "zustand";

type State = {
    deleteOpenModal: boolean,
    handleTrueDeleteOpenModal: ()=> void,
    handleFalseDeleteOpenModal: ()=> void,
    lotId: bigint|null,
    setLotId: (itemId: bigint|null)=> void,
    lotUnitPurchaseId: bigint|null,
    setLotUnitPurchaseId: (itemId: bigint|null)=> void,
}

export const useDeleteLotUnitPurchaseStore = create<State>()((set, get)=>({
    deleteOpenModal: false,
    lotId: null,
    setLotId(payload) {
        set(()=> ({lotId: payload}))
    },
    lotUnitPurchaseId: null,
    setLotUnitPurchaseId(payload) {
        set(()=> ({lotUnitPurchaseId: payload}))
    },
    handleTrueDeleteOpenModal() {
        set(()=> ({deleteOpenModal: true}))
    },
    handleFalseDeleteOpenModal() {
        set(()=> ({deleteOpenModal: false}))
    },
}));