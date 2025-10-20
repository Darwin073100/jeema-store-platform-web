import { create } from "zustand";

interface State {
    userStateCheck: boolean, 
    setUserStateCheck(payload: boolean): void,
    addressStateCheck: boolean, 
    setAddressStateCheck(payload: boolean): void,
}

const initialState = {
    userStateCheck: false,
    addressStateCheck: false
}

export const useEmployeeUIStore = create<State>()((set, get) => ({
    ...initialState,
    setAddressStateCheck: (payload: boolean)=>{
        set(()=>({
            addressStateCheck: payload
        }));
    },
    setUserStateCheck: (payload: boolean)=>{
        set(()=>({
            userStateCheck: payload
        }));
    },
}));