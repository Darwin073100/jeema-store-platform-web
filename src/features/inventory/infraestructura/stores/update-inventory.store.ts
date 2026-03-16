import { create } from "zustand";
import { IProduct } from "@/contexts/product-management/product/presentation/interfaces/IProduct";
import { IInventory } from "@/contexts/inventory-management/inventory/presentation/interfaces/IInventory";

type State = {
    updateOpenModal: boolean,
    selectedBranchOfficeId: bigint | null, 
    selectedProductId: bigint | null, 
    selectedProduct: IProduct | null,
    selectedLotId: bigint | null,
    setSelectedBranchOfficeId: (id: bigint | null) => void, 
    setSelectedProductId: (id: bigint | null) => void, 
    setSelectedProduct: (product: IProduct | null) => void, 
    setSelectedLotId: (id: bigint | null) => void, 
    handleTrueUpdateOpenModal: ()=> void,
    handleFalseUpdateOpenModal: ()=> void,
    inventory: IInventory |null,
    setInventory: (inventory: IInventory |null)=> void,
}

export const useUpdateInventoryStore = create<State>()((set, get)=>({
    inventory: null,
    updateOpenModal: false,
    selectedBranchOfficeId: null,
    selectedLotId: null,
    selectedProductId: null,
    selectedProduct: null,
    setSelectedBranchOfficeId(id) {
        set(()=> ({selectedBranchOfficeId: id}))
    },
    setSelectedLotId(id) {
        set(()=>({selectedLotId: id}))
    },
    setSelectedProductId(id) {
        set(()=>({selectedProductId: id}))
    },
    setSelectedProduct(product) {
        set(()=>({selectedProduct: product}))
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