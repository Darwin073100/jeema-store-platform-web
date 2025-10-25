import { FloatMessageType } from "@/shared/ui/types/FloatMessageType";
import { create } from "zustand";

interface State {
    userStateCheck: boolean, 
    setUserStateCheck(payload: boolean): void,
    addressStateCheck: boolean, 
    setAddressStateCheck(payload: boolean): void,
    //? Messages
    floatMessageState    : FloatMessageType;
    setFloatMessageState : (state: FloatMessageType) => void;
}

const initialState = {
    userStateCheck: false,
    addressStateCheck: false,
    //? Messages
    floatMessageState : {},
}

export const useEmployeeUIStore = create<State>()((set, get) => ({
    ...initialState,
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
}));