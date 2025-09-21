import { PaymentMethodEntity } from "@/features/payment-method/domain/entities/payment-method-entity";
import { create } from "zustand"

export interface Paids {
    paidCash: boolean, 
    paidTransfer: boolean
}

type State = {
    paymentMethods: PaymentMethodEntity[],
    paymentModal: boolean,
    cashAmount: number, 
    transferAmount: number, 
    transferNumberRef: string,
    paidAmount:number,
    customerChange: number,
    paids: Paids, 
    setTransferNumberRef: (payload: string)=> void,
    setPaids: (paids: Paids)=> void,
    handleTogglePaidCash: ()=> void,
    handleTogglePaidTransfer: ()=> void,
    setPaymentMethods:(payload: PaymentMethodEntity[])=> void,
    setCustomerChange: (payload: number)=> void,
    setPaidAmount: (payload: number)=> void,
    setCashAmount: (payload: number)=> void,
    setTransferAmount: (payload: number)=> void,
    openPaymentModal: ()=> void,
    closePaymentModal: ()=> void,
    resetSalePaymentStore: ()=> void,
}

const initialValues = {
    cashAmount: 0,
    transferAmount: 0,
    transferNumberRef: '',
        paidAmount: 0,
        customerChange: 0,
        paids: {
            paidCash: false,
            paidTransfer: false
        },
    };
    
    export const useSalePaymentStore = create<State>()((set, get)=>({
    paymentModal: false,
    paymentMethods: [],
    ...initialValues,
    setTransferNumberRef(payload: string) {
        set(()=>({
            transferNumberRef: payload
        }));
    },
    handleTogglePaidCash: ()=> {
        const prevPaids = get().paids;
        set(()=> ({
            paids: {
                ...prevPaids,
                paidCash: !prevPaids.paidCash
            }
        }));
    },
    handleTogglePaidTransfer: ()=> {
        const prevPaids = get().paids;
        set(()=> ({
            paids: {
                ...prevPaids,
                paidTransfer: !prevPaids.paidTransfer
            }
        }));
        
    },
    setPaids: (paids: Paids)=> {
        set(()=>({
            paids
        }))
    },
    setPaymentMethods: (payload: PaymentMethodEntity[])=> {
        set(()=>({
            paymentMethods: payload
        }));
    },
    setCustomerChange: (payload: number)=> {
        set(()=>({
            customerChange: payload
        }));
    },
    setCashAmount: (payload: number)=> {
        set(()=>({
            cashAmount: payload
        }));
    },
    setTransferAmount: (payload: number)=> {
        set(()=>({
            transferAmount: payload
        }));
    },
    setPaidAmount: (payload: number)=> {
        set(()=>({
            paidAmount: payload
        }));
    },
    closePaymentModal: ()=> {
        set(()=>({paymentModal: false}));
    },
    openPaymentModal: ()=> {
        set(()=>({
            paymentModal: true
        }));
    },
    resetSalePaymentStore: ()=> {
        set(initialValues);
    }
}));