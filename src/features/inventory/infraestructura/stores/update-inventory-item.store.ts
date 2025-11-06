import { create } from "zustand";
import { InventoryItemEntity } from "../../domain/entities/inventory-item-response.dto";

type State = {
    updateOpenModal: boolean,
    transferModal: boolean,
    selectedInventoryId: bigint | null,
    setSelectedInventoryId: (id: bigint | null) => void, 
    handleTrueUpdateOpenModal: ()=> void,
    handleFalseUpdateOpenModal: ()=> void,
    handleOpenModal: ()=> void,
    handleCloseModal: ()=> void,
    inventoryItem: InventoryItemEntity|null,
    setInventoryItem: (item: InventoryItemEntity|null)=> void,
}

export const useUpdateInventoryItemStore = create<State>()((set, get)=>({
    inventoryItem: null,
    updateOpenModal: false,
    selectedInventoryId: null,
    transferModal: false,
    handleCloseModal() {
        
    },
    handleOpenModal() {
        
    },
    setSelectedInventoryId(id) {
        set(()=> ({selectedInventoryId: id}))
    },
    setInventoryItem(payload) {
        set(()=> ({inventoryItem: payload}))
    },
    handleTrueUpdateOpenModal() {
        set(()=> ({updateOpenModal: true}))
    },
    handleFalseUpdateOpenModal() {
        set(()=> ({updateOpenModal: false}))
    },
}));