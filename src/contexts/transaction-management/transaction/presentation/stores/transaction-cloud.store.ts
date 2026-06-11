import { create } from "zustand";

type State = {
    enrollmentKey: string,
    setEnrollmentKey: (payload: string)=> void,
    establishmentName: string,
    setEstablishmentName: (payload: string)=> void,
};

export const useTransactionCloudStore = create<State>()((set, get)=>({
    enrollmentKey: "",
    setEnrollmentKey: (payload)=>{
        set(()=>({enrollmentKey: payload}));
    },
    establishmentName: "",
    setEstablishmentName: (payload)=>{
        set(()=>({establishmentName: payload}));
    },
}));