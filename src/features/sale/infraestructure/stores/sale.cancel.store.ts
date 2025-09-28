import { create } from "zustand";

type State = {
    cancelSaleModal: boolean,
    handleOpenCancelSaleModal: () => void,
    handleCloseCancelSaleModal: () => void,
    resetSalePaymentStore: () => void,
}

const initialValues = {
    
};

export const useSaleCancelStore = create<State>()((set, get) => ({
    cancelSaleModal: false,
    ...initialValues,    
    handleCloseCancelSaleModal: () => {
        set(() => ({ cancelSaleModal: false }));
    },
    handleOpenCancelSaleModal: () => {
        set(() => ({
            cancelSaleModal: true
        }));
    },
    resetSalePaymentStore: () => {
        set(initialValues);
    }
}));