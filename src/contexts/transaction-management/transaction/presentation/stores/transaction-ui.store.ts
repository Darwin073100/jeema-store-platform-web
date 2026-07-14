import { create } from "zustand";
import { FloatMessageType } from "@/shared/ui/types/FloatMessageType";
type TransactionLoadingsType = 'none' | 'downloadListTransaction' |  'filterTransaction' | 'generate-enrollment-key' | 'register-cloud-branch-and-establishment';
type State = {
    //? Messages
    floatMessageState    : FloatMessageType;
    setFloatMessageState : (state: FloatMessageType) => void;
    //? Loadings
    loading              : TransactionLoadingsType;
    initLoading          : (payload: TransactionLoadingsType) => void;
    finishLoading        : ()=> void;
    resetModals          : () => void;
};

const initialState = {
    //? Messages
    floatMessageState : {},
    //? Loadings
    loading           : 'none' as TransactionLoadingsType,
};

export const useTransactionUIStore = create<State>()((set, get)=>({
    ...initialState,
    //? Messages
    setFloatMessageState : (state: FloatMessageType) => set({ floatMessageState: state }),
    //? Loadings
    initLoading          : (payload: TransactionLoadingsType) => set({ loading: payload }),
    finishLoading        : () => set({ loading: 'none' }),
    //? Reset Store 
    resetModals          : () => set(initialState),
}));