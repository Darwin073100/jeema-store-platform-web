import { FloatMessageType } from "@/shared/ui/types/FloatMessageType";
import { create } from "zustand";
import { SaleLoadingsType } from "./types/sale-loadings-type";
import { SaleModalsType } from "./types/sale-modals-type";

interface UIState {
    //? Modales
    saleModals           : SaleModalsType;
    openSaleModal        : (payload: SaleModalsType) => void;
    closeSaleModal       : () => void;
    //? Messages
    floatMessageState    : FloatMessageType;
    setFloatMessageState : (state: FloatMessageType) => void;
    //? Loadings
    loading              : SaleLoadingsType,
    initLoading          : (payload: SaleLoadingsType) => void,
    finishLoading        : ()=> void,
    resetModals          : () => void;
}

const initialState = {
    //? Modales
    saleModals        : 'none' as SaleModalsType,
    //? Messages
    floatMessageState : {},
    //? Loadings
    loading           : 'empty' as SaleLoadingsType,
};

export const useSaleUIStore = create<UIState>()((set, get) => ({
    ...initialState,
    //? Modales
    openSaleModal        : (payload) => set({ saleModals: payload }),
    closeSaleModal       : () => set({ saleModals: 'none' }),
    //? Messages
    setFloatMessageState : (state: FloatMessageType) => set({ floatMessageState: state }),
    //? Loadings
    initLoading          : (payload: SaleLoadingsType) => set({ loading: payload }),
    finishLoading        : () => set({ loading: 'none' }),
    resetModals          : () => set(initialState),
}));