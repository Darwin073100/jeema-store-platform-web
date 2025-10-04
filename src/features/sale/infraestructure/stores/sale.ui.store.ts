import { FloatMessageType } from "@/shared/ui/types/FloatMessageType";
import { create } from "zustand";

interface UIState {
    floatMessageState       : FloatMessageType;
    cancelSaleModal         : boolean;
    deleteDetailModal       : boolean;
    customerListModal       : boolean;
    inventoryListModal      : boolean;
    paymentModal            : boolean;
    updateDetailModal       : boolean;
    setFloatMessageState    : (state: FloatMessageType) => void;
    openCancelSaleModal     : () => void;
    closeCancelSaleModal    : () => void;
    openDeleteDetailModal   : () => void;
    closeDeleteDetailModal  : () => void;
    openCustomerListModal   : () => void;
    closeCustomerListModal  : () => void;
    openInventoryListModal  : () => void;
    closeInventoryListModal : () => void;
    openPaymentModal        : () => void;
    closePaymentModal       : () => void;
    openUpdateDetailModal   : () => void;
    closeUpdateDetailModal  : () => void;
    resetModals             : () => void;
}

const initialState = {
    cancelSaleModal    : false,
    deleteDetailModal  : false,
    customerListModal  : false,
    inventoryListModal : false,
    paymentModal       : false,
    updateDetailModal  : false,
    floatMessageState  : {},
};

export const useSaleUIStore = create<UIState>()((set, get) => ({
    ...initialState,
    setFloatMessageState: (state: FloatMessageType) => set({ floatMessageState: state }),
    openCancelSaleModal: () => set({ cancelSaleModal: true }),
    closeCancelSaleModal: () => set({ cancelSaleModal: false }),
    openDeleteDetailModal: () => set({ deleteDetailModal: true }),
    closeDeleteDetailModal: () => set({ deleteDetailModal: false }),
    openCustomerListModal: () => set({ customerListModal: true }),
    closeCustomerListModal: () => set({ customerListModal: false }),
    openInventoryListModal: () => set({ inventoryListModal: true }),
    closeInventoryListModal: () => set({ inventoryListModal: false }),
    openPaymentModal: () => set({ paymentModal: true }),
    closePaymentModal: () => set({ paymentModal: false }),
    openUpdateDetailModal: () => set({ updateDetailModal: true }),
    closeUpdateDetailModal: () => set({ updateDetailModal: false }),
    resetModals: () => set(initialState),
}));