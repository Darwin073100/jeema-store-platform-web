import { create } from "zustand"

type State = {
    paymentModal: boolean,
    openPaymentModal: ()=> void,
    closePaymentModal: ()=> void,
}

export const useSalePaymentStore = create<State>()((set, get)=>({
    paymentModal: false,
    closePaymentModal: ()=> {
        set(()=>({paymentModal: false}));
    },
    openPaymentModal: ()=> {
        set(()=>({
            paymentModal: true
        }));
    },
}));