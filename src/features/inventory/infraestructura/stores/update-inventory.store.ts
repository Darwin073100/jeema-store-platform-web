import { create } from "zustand";
import { InventoryEntity } from "../../domain/entities/inventory.entity";

type State = {
    updateOpenModal: boolean,
    selectedBranchOfficeId: bigint | null, 
    selectedProductId: bigint | null, 
    selectedLotId: bigint | null,
    setSelectedBranchOfficeId: (id: bigint | null) => void, 
    setSelectedProductId: (id: bigint | null) => void, 
    setSelectedLotId: (id: bigint | null) => void, 
    handleTrueUpdateOpenModal: ()=> void,
    handleFalseUpdateOpenModal: ()=> void,
    inventory: InventoryEntity|null,
    setInventory: (inventory: InventoryEntity|null)=> void,
}

export const useUpdateInventoryStore = create<State>()((set, get)=>({
    inventory: null,
    updateOpenModal: false,
    selectedBranchOfficeId: null,
    selectedLotId: null,
    selectedProductId: null,
    setSelectedBranchOfficeId(id) {
        set(()=> ({selectedBranchOfficeId: id}))
    },
    setSelectedLotId(id) {
        set(()=>({selectedLotId: id}))
    },
    setSelectedProductId(id) {
        set(()=>({selectedProductId: id}))
    },
    setInventory(payload) {
        set(()=> ({inventory: payload}))
    },
    handleTrueUpdateOpenModal() {
        set(()=> ({updateOpenModal: true}))
    },
    handleFalseUpdateOpenModal() {
        set(()=> ({updateOpenModal: false}))
    },
}));