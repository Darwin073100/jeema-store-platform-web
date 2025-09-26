import { InventoryItemEntity } from "@/features/inventory/domain/entities/inventory-item.entity"
import { create } from "zustand"


type State = {
    itemSelected: InventoryItemEntity | null,
    setItemSelected: (payload: InventoryItemEntity | null)=> void,
    inventoryItems: InventoryItemEntity[],
    filterInventoryItems: InventoryItemEntity[],
    setFilterInventoryItems: (items: InventoryItemEntity[])=> void,
    setInventoryItems: (items: InventoryItemEntity[])=> void,
    modalInventoryList: boolean,
    openModalInventoryList: ()=> void,
    closeModalInventoryList: ()=> void
}

const initialValues = {
    modalInventoryList: false,
    filterInventoryItems: [],
    itemSelected: null,
}

export const useSaleInventoryListStore = create<State>()((set, get)=>({
    ...initialValues,
    inventoryItems:[],
    setItemSelected: (payload: InventoryItemEntity | null)=> {
        const prev = get().itemSelected;
        set(()=>({
            itemSelected: prev?.inventoryItemId !== payload?.inventoryItemId? payload: null 
        }));
    },
    setFilterInventoryItems: (items: InventoryItemEntity[])=>{
        set(()=>({
            filterInventoryItems: items
        }));
    },
    setInventoryItems: (items: InventoryItemEntity[])=>{
        set(()=>({
            inventoryItems: items
        }));
    },
    closeModalInventoryList: ()=>{
        set(()=>({ modalInventoryList: false}));
    },
    openModalInventoryList: ()=> {
        set(()=>({ modalInventoryList: true}));
    },

    resetSaleStore: ()=> {
        set(initialValues);
    }
}));