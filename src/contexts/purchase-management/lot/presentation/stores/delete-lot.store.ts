import { create } from "zustand";

type State = {
    deleteOpenModal: boolean,
    handleTrueDeleteOpenModal: ()=> void,
    handleFalseDeleteOpenModal: ()=> void,
    lotId: bigint|null,
    setLotId: (itemId: bigint|null)=> void,
}

export const useDeleteLotStore = create<State>()((set, get)=>({
    deleteOpenModal: false,
    lotId: null,
    setLotId(payload) {
        set(()=> ({lotId: payload}))
    },
    handleTrueDeleteOpenModal() {
        set(()=> ({deleteOpenModal: true}))
    },
    handleFalseDeleteOpenModal() {
        set(()=> ({deleteOpenModal: false}))
    },
}));