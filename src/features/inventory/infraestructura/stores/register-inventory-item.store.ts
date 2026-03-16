import { create } from "zustand";
import { IInventoryItem } from "@/contexts/inventory-management/inventory-item/presentation/interfaces/IInventoryItem";

type State = {
    saveOpenModal: boolean,
    inventoryItems: IInventoryItem[],
    setInventoryItems: (payload: IInventoryItem[]) => void,
    selectedInventoryId: bigint | null,
    setSelectedInventoryId: (id: bigint | null) => void, 
    handleTrueSaveOpenModal: ()=> void,
    handleFalseSaveOpenModal: ()=> void,
    inventoryItem: IInventoryItem|null,
    setInventoryItem: (item: IInventoryItem|null)=> void,
}

export const useRegisterInventoryItemStore = create<State>()((set, get)=>({
    inventoryItem: null,
    saveOpenModal: false,
    selectedInventoryId: null,
    inventoryItems: [],
    setInventoryItems: (payload: IInventoryItem[])=>{
        set(()=>({inventoryItems: payload}));
    },
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