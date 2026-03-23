import { ISaleDetail } from "@/contexts/sale-management/sale-detail/presentation/interfaces/ISaleDetail";
import { create } from "zustand";

type State = {
    selectDetail: ISaleDetail | null,
    setSelectDetail: (payload: ISaleDetail | null)=> void,
}

const initialValues = {
    selectDetail: null,
}

export const useReturnsStore = create<State>()((set, get)=>({
    ...initialValues,
    setSelectDetail: (payload)=> {
        set(()=>({
            selectDetail: payload
        }));
    }
}))