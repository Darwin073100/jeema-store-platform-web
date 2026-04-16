import { FloatMessageType } from "@/shared/ui/types/FloatMessageType";
import { create } from "zustand";

type ModalType  = 'editCustomer' | 'addAddress' | 'none';
type LoadingType = 'editCustomer' | 'addAddress' | 'saveCustomer' | 'none';

interface State {
    customerModal: ModalType,
    closeCustomerModal: () => void,
    openCustomerModal: (modalType: ModalType) => void,
    //? Messages
    floatMessageState    : FloatMessageType;
    setFloatMessageState : (state: FloatMessageType) => void;
    //?Loadings
    loading: LoadingType,
    runLoading: (payload: LoadingType)=> void,
    stopLoading: ()=> void,
}

const initialState = {
    userStateCheck: false,
    addressStateCheck: false,
    //? Messages
    floatMessageState : {},
    //? Modals
    customerModal: 'none' as ModalType,
    //? Loadings
    loading: 'none' as LoadingType,
}

export const useCustomerUIStore = create<State>()((set, get) => ({
    ...initialState,
    closeCustomerModal: () => {
        set(()=>({
            customerModal: 'none'
        }));
    },
    openCustomerModal: (modalType: ModalType) => {
        set(()=>({
            customerModal: modalType
        }));
    },
    //? Messages
    setFloatMessageState : (state: FloatMessageType) => set({ floatMessageState: state }),
    //? Loadings
    runLoading: (payload: LoadingType)=>{
        set(()=>({ loading: payload}))
    },
    stopLoading: ()=> {
        set(()=>({loading: 'none'}))
    }
}));