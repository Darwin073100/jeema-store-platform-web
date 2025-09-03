import { create } from "zustand";
import { InventoryItemEntity } from "../../domain/entities/inventory-item-response.dto";

type State = {
    saveOpenModal: boolean,
    selectedInventoryId: bigint | null,
    setSelectedInventoryId: (id: bigint | null) => void, 
    handleTrueSaveOpenModal: ()=> void,
    handleFalseSaveOpenModal: ()=> void,
    inventoryItem: InventoryItemEntity|null,
    setInventoryItem: (item: InventoryItemEntity|null)=> void,
}

export const useRegisterInventoryItemStore = create<State>()((set, get)=>({
    inventoryItem: null,
    saveOpenModal: false,
    selectedInventoryId: null,
    setSelectedInventoryId(id) {
        set(()=> ({selectedInventoryId: id}))
    },
    setInventoryItem(payload) {
        set(()=> ({inventoryItem: payload}))
    },
    handleTrueSaveOpenModal() {
        set(()=> ({saveOpenModal: true}))
    },
    handleFalseSaveOpenModal() {
        set(()=> ({saveOpenModal: false}))
    },
}));