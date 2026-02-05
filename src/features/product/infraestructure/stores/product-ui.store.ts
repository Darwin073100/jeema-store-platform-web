import { FloatMessageType } from "@/shared/ui/types/FloatMessageType";
import { create } from "zustand";
type ProductModalsType = 'none' | 'printLabels' | 'printLabels-51x25';
type ProductLoadingsType = 'none' | 'printLabels';

interface UIState {
    //? Modales
    productModals           : ProductModalsType;
    openProductModal        : (payload: ProductModalsType) => void;
    closeProductModal       : () => void;
    //? Messages
    floatMessageState    : FloatMessageType;
    setFloatMessageState : (state: FloatMessageType) => void;
    //? Loadings
    loading              : ProductLoadingsType,
    initLoading          : (payload: ProductLoadingsType) => void,
    finishLoading        : ()=> void,
    resetModals          : () => void;
    //? Ticket
    viewTicket: boolean;
    setViewTicket: (payload: boolean)=> void;
}

const initialState = {
    //? Modales
    productModals        : 'none' as ProductModalsType,
    //? Messages
    floatMessageState : {},
    //? Loadings
    loading           : 'none' as ProductLoadingsType,
    //? Ticket
    viewTicket        : false,
};

export const useProductUIStore = create<UIState>()((set, get) => ({
    ...initialState,
    //? Modales
    openProductModal        : (payload) => set({ productModals: payload }),
    closeProductModal       : () => set({ productModals: 'none' }),
    //? Messages
    setFloatMessageState : (state: FloatMessageType) => set({ floatMessageState: state }),
    //? Loadings
    initLoading          : (payload: ProductLoadingsType) => set({ loading: payload }),
    finishLoading        : () => set({ loading: 'none' }),
    //? Ticket
    setViewTicket        : (payload)=> set(()=>({viewTicket: payload})),
    //? Reset Store 
    resetModals          : () => set(initialState),
}));