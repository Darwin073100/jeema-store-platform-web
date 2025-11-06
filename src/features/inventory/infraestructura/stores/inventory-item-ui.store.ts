import { FloatMessageType } from "@/shared/ui/types/FloatMessageType";
import { create } from "zustand";
type ModalType = 'register' | 'update' | 'transfer' | 'delete' | 'none';
type LoadingType = 'registering' | 'updating' | 'transferring' | 'deleting' | 'none';
type State = {
    //? Modal
    inventoryItemModal: ModalType,
    openInventoryItemModal: (type: ModalType) => void,
    closeInventoryItemModal: () => void,
    //? Loading
    inventoryItemLoading: LoadingType,
    runInventoryItemLoading: (type: LoadingType) => void,
    stopInventoryItemLoading: () => void,
    //? Float Message
    floatMessageState: FloatMessageType,
    setFloatMessageState: (payload: FloatMessageType) => void,
}


export const useInventoryItemUIStore = create<State>()((set, get)=>({
    //? Modal
    inventoryItemModal: 'none',
    openInventoryItemModal: (type) => set(() => ({ inventoryItemModal: type })),
    closeInventoryItemModal: () => set(() => ({ inventoryItemModal: 'none' })),
    //? Loading
    inventoryItemLoading: 'none',
    runInventoryItemLoading: (type) => set(() => ({ inventoryItemLoading: type })),
    stopInventoryItemLoading: () => set(() => ({ inventoryItemLoading: 'none' })),
    //? Float Message
    floatMessageState:{},
    setFloatMessageState: (payload) => set(() => ({ floatMessageState: payload })),
}));