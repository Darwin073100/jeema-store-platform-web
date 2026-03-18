import { create } from "zustand";
import { InventoryResponseDTO } from "../../../../../features/inventory/domain/entities/inventory-response.dto";

type State = {
    searchCharacter: string,
    // filterInventary: InventoryItemEntity[]|[],
    items: InventoryResponseDTO[]|[],
    setItems: (value: InventoryResponseDTO[])=> void,
    item: InventoryResponseDTO|null,
    openModal: boolean,
    setOpenModal: (value:boolean)=> void
};

export const useInventoryItemStore = create<State>()((set, get)=>({
    searchCharacter: "",
    item: null,
    items:[],
    setItems(value) {
        set(()=> ({items: value}))
    },
    openModal: false,
    setOpenModal(value) {
        set(()=> ({openModal: value}))
    },
}));