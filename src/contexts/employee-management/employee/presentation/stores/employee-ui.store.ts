import { FloatMessageType } from "@/shared/ui/types/FloatMessageType";
import { create } from "zustand";

type ModalType  = 'registerUser' | 'editEmployee' | 'resetPassword' |
    'none' | 'editUser' | 'editUserRole' | 'deleteUserRole' | 'addRoleToUser' |
    'addAddress' | 'editAddress';
type LoadingType = 'registerUser' | 'editEmployee' | 'stateUser' | 'resetPassword' | 
    'none' | 'editUser' | 'editUserRole' | 'deleteUserRole' | 'addRoleToUser' | 'addAddress' |
    'editAddress';

interface State {
    employeeModal: ModalType,
    closeEmployeeModal: () => void,
    openEmployeeModal: (modalType: ModalType) => void,
    //? Toggle States
    userStateCheck: boolean, 
    setUserStateCheck(payload: boolean): void,
    addressStateCheck: boolean, 
    setAddressStateCheck(payload: boolean): void,
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
    employeeModal: 'none' as ModalType,
    //? Loadings
    loading: 'none' as LoadingType,
}

export const useEmployeeUIStore = create<State>()((set, get) => ({
    ...initialState,
    closeEmployeeModal: () => {
        set(()=>({
            employeeModal: 'none'
        }));
    },
    openEmployeeModal: (modalType: ModalType) => {
        set(()=>({
            employeeModal: modalType
        }));
    },
    setAddressStateCheck: (payload: boolean)=>{
        set(()=>({
            addressStateCheck: payload
        }));
    },
    //? Messages
    setFloatMessageState : (state: FloatMessageType) => set({ floatMessageState: state }),
    setUserStateCheck: (payload: boolean)=>{
        set(()=>({
            userStateCheck: payload
        }));
    },
    //? Loadings
    runLoading: (payload: LoadingType)=>{
        set(()=>({ loading: payload}))
    },
    stopLoading: ()=> {
        set(()=>({loading: 'none'}))
    }
}));