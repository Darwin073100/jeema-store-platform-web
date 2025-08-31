import { create } from "zustand";

type RegisterLotModalState = {
    openModal: boolean;
    selectedProductId: string;
    setOpenModal: (value: boolean) => void;
    setSelectedProductId: (productId: string) => void;
    handleOpenRegisterLotModal: (productId?: string) => void;
    handleCloseRegisterLotModal: () => void;
};

export const useRegisterLotModalStore = create<RegisterLotModalState>()((set, get) => ({
    openModal: false,
    selectedProductId: '',
    setOpenModal: (value) => set(() => ({ openModal: value })),
    setSelectedProductId: (productId) => set(() => ({ selectedProductId: productId })),
    handleOpenRegisterLotModal: (productId) => {
        if (productId) {
            set(() => ({ selectedProductId: productId }));
        }
        set(() => ({ openModal: true }));
    },
    handleCloseRegisterLotModal: () => {
        set(() => ({ 
            openModal: false, 
            selectedProductId: '' 
        }));
    }
}));
