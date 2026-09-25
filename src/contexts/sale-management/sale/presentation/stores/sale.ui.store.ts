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
    //? Ticket
    pdfUrl: string | null;
    setPdfUrl: (payload: string | null)=> void;
    viewTicket: boolean;
    setViewTicket: (payload: boolean)=> void;
    // Venta objetivo de una reimpresión disparada desde una pantalla con múltiples ventas en
    // contexto (listado de ventas) — el detalle de venta también la usa para mantener una sola
    // fuente de verdad en vez de pasar saleId por prop. BigInt(0) = "ninguna seleccionada".
    reprintTargetSaleId: bigint;
    setReprintTargetSaleId: (payload: bigint) => void;
}

const initialState = {
    //? Modales
    saleModals        : 'none' as SaleModalsType,
    //? Messages
    floatMessageState : {},
    //? Loadings
    loading           : 'empty' as SaleLoadingsType,
    //? Ticket
    viewTicket        : false,
    pdfUrl: null,
    reprintTargetSaleId: BigInt(0),
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
    //? Ticket
    setPdfUrl: (payload: string | null)=>{
        set(()=>({
            pdfUrl: payload
        }))
    },
    setViewTicket        : (payload)=> set(()=>({viewTicket: payload})),
    setReprintTargetSaleId: (payload) => set({ reprintTargetSaleId: payload }),
    //? Reset Store 
    resetModals          : () => set(initialState),
}));