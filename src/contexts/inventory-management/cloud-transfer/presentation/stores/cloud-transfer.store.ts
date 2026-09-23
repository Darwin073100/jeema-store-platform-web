import { create } from "zustand";
import { ICloudTransfer } from "../interfaces/ICloudTransfer";
import { LocationEnum } from "@/contexts/inventory-management/inventory-item/domain/enums/location.enum";

/** Línea del carrito de creación (pantalla "Nuevo traspaso"). Solo existe en el cliente, nunca se persiste
 * tal cual — `createAndSendCloudTransferAction` solo recibe ids + cantidad (ver CreateCloudTransferDto). */
export interface DraftCloudTransferItem {
    key: string; // `${productId}-${lotId}-${inventoryItemId}`, para el key de React y evitar duplicados
    originLocalProductId: bigint;
    originLocalLotId: bigint;
    originLocalInventoryItemId: bigint;
    productName: string;
    productUniversalBarCode: string | null;
    lotNumber: string;
    location: LocationEnum;
    availableQuantity: number;
    quantityToTransfer: number;
}

type State = {
    //? Listado (ambas direcciones, ya se filtra en UI por `listTab`)
    transfers: ICloudTransfer[],
    setTransfers: (items: ICloudTransfer[]) => void,
    //? Detalle actualmente visible
    selectedTransfer: ICloudTransfer | null,
    setSelectedTransfer: (item: ICloudTransfer | null) => void,
    //? Carrito de creación
    draftItems: DraftCloudTransferItem[],
    addDraftItem: (item: DraftCloudTransferItem) => void,
    updateDraftItemQuantity: (key: string, quantity: number) => void,
    removeDraftItem: (key: string) => void,
    clearDraftItems: () => void,
}

export const useCloudTransferStore = create<State>()((set, get) => ({
    transfers: [],
    setTransfers: (items) => set(() => ({ transfers: items })),
    selectedTransfer: null,
    setSelectedTransfer: (item) => set(() => ({ selectedTransfer: item })),
    draftItems: [],
    addDraftItem: (item) => set((state) => {
        if (state.draftItems.some(i => i.key === item.key)) return state;
        return { draftItems: [...state.draftItems, item] };
    }),
    updateDraftItemQuantity: (key, quantity) => set((state) => ({
        draftItems: state.draftItems.map(i => i.key === key ? { ...i, quantityToTransfer: quantity } : i),
    })),
    removeDraftItem: (key) => set((state) => ({ draftItems: state.draftItems.filter(i => i.key !== key) })),
    clearDraftItems: () => set(() => ({ draftItems: [] })),
}));
