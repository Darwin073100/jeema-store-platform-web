import { FloatMessageType } from "@/shared/ui/types/FloatMessageType";
import { create } from "zustand";

type ModalType = 'editBranchOffice' | 'addAddress' | 'editAddress' | 'none';
type LoadingType = 'editBranchOffice' | 'addAddress' | 'editAddress' | 'saveBranchOffice' | 'none';

interface State {
    branchOfficeModal: ModalType,
    closeBranchOfficeModal: () => void,
    openBranchOfficeModal: (modalType: ModalType) => void,
    //? Messages
    floatMessageState: FloatMessageType;
    setFloatMessageState: (state: FloatMessageType) => void;
    //?Loadings
    loading: LoadingType,
    runLoading: (payload: LoadingType) => void,
    stopLoading: () => void,
}

const initialState = {
    userStateCheck: false,
    addressStateCheck: false,
    //? Messages
    floatMessageState: {},
    //? Modals
    branchOfficeModal: 'none' as ModalType,
    //? Loadings
    loading: 'none' as LoadingType,
}

export const useCustomerUIStore = create<State>()((set, get) => ({
    ...initialState,
    closeBranchOfficeModal: () => {
        set(() => ({
            branchOfficeModal: 'none'
        }));
    },
    openBranchOfficeModal: (modalType: ModalType) => {
        set(() => ({
            branchOfficeModal: modalType
        }));
    },
    //? Messages
    setFloatMessageState: (state: FloatMessageType) => set({ floatMessageState: state }),
    //? Loadings
    runLoading: (payload: LoadingType) => {
        set(() => ({ loading: payload }))
    },
    stopLoading: () => {
        set(() => ({ loading: 'none' }))
    }
}));