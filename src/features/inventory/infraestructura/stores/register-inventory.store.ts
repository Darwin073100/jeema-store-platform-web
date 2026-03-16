import { create } from "zustand";
import { IProduct } from "@/contexts/product-management/product/presentation/interfaces/IProduct";
import { IInventory } from "@/contexts/inventory-management/inventory/presentation/interfaces/IInventory";

type State = {
    saveOpenModal: boolean,
    selectedBranchOfficeId: bigint | null, 
    selectedProductId: bigint | null, 
    selectedProduct: IProduct | null,
    setSelectedProduct: (product: IProduct | null) => void, 
    selectedLotId: bigint | null,
    setSelectedBranchOfficeId: (id: bigint | null) => void, 
    setSelectedProductId: (id: bigint | null) => void, 
    setSelectedLotId: (id: bigint | null) => void, 
    handleTrueSaveOpenModal: ()=> void,
    handleFalseSaveOpenModal: ()=> void,
    inventory: IInventory|null,
    setInventory: (inventory: IInventory|null)=> void,
}

export const useRegisterInventoryStore = create<State>()((set, get)=>({
    inventory: null,
    saveOpenModal: false,
    selectedBranchOfficeId: null,
    selectedLotId: null,
    selectedProduct: null,
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
    setSelectedProduct(product) {
    set(()=>({selectedProduct: product}))
    },
    setInventory(payload) {
        set(()=> ({inventory: payload}))
    },
    handleTrueSaveOpenModal() {
        set(()=> ({saveOpenModal: true}))
    },
    handleFalseSaveOpenModal() {
        set(()=> ({saveOpenModal: false}))
    },
}));