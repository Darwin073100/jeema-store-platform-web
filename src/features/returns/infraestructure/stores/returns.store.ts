import { SaleDetailEntity } from "@/features/sale/domain/entities/sale-detail-entity";
import { create } from "zustand";

type State = {
    selectDetail: SaleDetailEntity | null,
    setSelectDetail: (payload: SaleDetailEntity | null)=> void,
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