import { create } from "zustand";
import { InventoryEntity } from "../../domain/entities/inventory.entity";
import { ProductEntity } from "@/features/product/domain/entities/product.entity";

type State = {
    saveOpenModal: boolean,
    selectedBranchOfficeId: bigint | null, 
    selectedProductId: bigint | null, 
    selectedProduct: ProductEntity | null,
    setSelectedProduct: (product: ProductEntity | null) => void, 
    selectedLotId: bigint | null,
    setSelectedBranchOfficeId: (id: bigint | null) => void, 
    setSelectedProductId: (id: bigint | null) => void, 
    setSelectedLotId: (id: bigint | null) => void, 
    handleTrueSaveOpenModal: ()=> void,
    handleFalseSaveOpenModal: ()=> void,
    inventory: InventoryEntity|null,
    setInventory: (inventory: InventoryEntity|null)=> void,
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