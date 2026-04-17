import { FloatMessageType } from "@/shared/ui/types/FloatMessageType";
import { create } from "zustand";

type ModalType  = 'editSuplier' | 'addAddress' | 'editAddress' | 'none';
type LoadingType = 'editSuplier' | 'saveSuplier' | 'addAddress' | 'editAddress' | 'none';

interface State {
    suplierModal: ModalType,
    closeSuplierModal: () => void,
    openSuplierModal: (modalType: ModalType) => void,
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
    suplierModal: 'none' as ModalType,
    //? Loadings
    loading: 'none' as LoadingType,
}

export const useSuplierUIStore = create<State>()((set, get) => ({
    ...initialState,
    closeSuplierModal: () => {
        set(()=>({
            suplierModal: 'none'
        }));
    },
    openSuplierModal: (modalType: ModalType) => {
        set(()=>({
            suplierModal: modalType
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