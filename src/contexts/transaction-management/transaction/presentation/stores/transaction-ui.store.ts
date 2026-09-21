import { create } from "zustand";
import { FloatMessageType } from "@/shared/ui/types/FloatMessageType";
type TransactionLoadingsType = 'none' | 'downloadListTransaction' |  'filterTransaction' | 'generate-enrollment-key' |
    'register-cloud-branch-and-establishment' | 'register-cloud-branch';
type TransactionModalType = 'none' | 'transactionMovementsReportTicket';
type State = {
    //? Messages
    floatMessageState    : FloatMessageType;
    setFloatMessageState : (state: FloatMessageType) => void;
    //? Loadings
    loading              : TransactionLoadingsType;
    initLoading          : (payload: TransactionLoadingsType) => void;
    finishLoading        : ()=> void;
    resetModals          : () => void;
    //? Modals
    transactionModal      : TransactionModalType,
    openTransactionModal   : (modalType: TransactionModalType) => void,
    closeTransactionModal  : () => void,
};

const initialState = {
    //? Messages
    floatMessageState : {},
    //? Loadings
    loading           : 'none' as TransactionLoadingsType,
    //? Modals
    transactionModal  : 'none' as TransactionModalType,
};

export const useTransactionUIStore = create<State>()((set, get)=>({
    ...initialState,
    //? Messages
    setFloatMessageState : (state: FloatMessageType) => set({ floatMessageState: state }),
    //? Loadings
    initLoading          : (payload: TransactionLoadingsType) => set({ loading: payload }),
    finishLoading        : () => set({ loading: 'none' }),
    //? Modals
    openTransactionModal : (modalType) => set(()=>({ transactionModal: modalType })),
    closeTransactionModal: () => set(()=>({ transactionModal: 'none' })),
    //? Reset Store
    resetModals          : () => set(initialState),
}));