import { FloatMessageType } from "@/shared/ui/types/FloatMessageType";
import { create } from "zustand";

type ModalType  = 'registerCashRegister' | 'openCashSession' | 'closeCashSession' | 'none';
type LoadingType = 'registerCashRegister' | 'openCashSession' | 'closeCashSession' | 'movementsCashSession' | 'none';

interface State {
    //? Modals
    cashModal: ModalType,
    closeCashModal: () => void,
    openCashModal: (modalType: ModalType) => void,
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
    cashModal: 'none' as ModalType,
    //? Loadings
    loading: 'none' as LoadingType,
}

export const useCashUIStore = create<State>()((set, get) => ({
    ...initialState,
    //? Modals
    closeCashModal: () => {
        set(()=>({
            cashModal: 'none'
        }));
    },
    openCashModal: (modalType: ModalType) => {
        set(()=>({
            cashModal: modalType
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