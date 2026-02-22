import { create } from "zustand";
import { FloatMessageType } from "@/shared/ui/types/FloatMessageType";
type LotLoadingsType = 'none' | 'find-report-lots';
type State = {
    //? Messages
    floatMessageState    : FloatMessageType;
    setFloatMessageState : (state: FloatMessageType) => void;
    //? Loadings
    loading              : LotLoadingsType;
    initLoading          : (payload: LotLoadingsType) => void;
    finishLoading        : ()=> void;
    resetModals          : () => void;
};

const initialState = {
    //? Messages
    floatMessageState : {},
    //? Loadings
    loading           : 'none' as LotLoadingsType,
};

export const useLotUIStore = create<State>()((set, get)=>({
    ...initialState,
    //? Messages
    setFloatMessageState : (state: FloatMessageType) => set({ floatMessageState: state }),
    //? Loadings
    initLoading          : (payload: LotLoadingsType) => set({ loading: payload }),
    finishLoading        : () => set({ loading: 'none' }),
    //? Reset Store 
    resetModals          : () => set(initialState),
}));