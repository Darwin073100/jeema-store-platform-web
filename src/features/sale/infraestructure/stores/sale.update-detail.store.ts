import { create } from "zustand";
import { SaleDetailEntity } from "../../domain/entities/sale-detail-entity";
import { InventoryItemEntity } from "@/features/inventory/domain/entities/inventory-item.entity";

type State = {
    updateDetailModal: boolean,
    detailSelected: null | SaleDetailEntity,
    itemMatchDetail: null| InventoryItemEntity,
    setItemMatchDetail: (payload: null| InventoryItemEntity)=> void,
    setDetailSelected: (payload: null | SaleDetailEntity)=> void,
    handleOpenUpdateDetailModal: () => void,
    handleCloseUpdateDetailModal: () => void,
    resetUpdateDetailStore: () => void,
}

const initialValues = {
    updateDetailModal: false,
    detailSelected: null,
    itemMatchDetail: null,
};

export const useSaleUpdateDetailStore = create<State>()((set, get) => ({
    ...initialValues,
    setItemMatchDetail: (payload: null| InventoryItemEntity)=>{
        set(()=>({
            itemMatchDetail: payload
        }));
    },
    setDetailSelected: (payload: null | SaleDetailEntity)=>{
        set(()=>({
            detailSelected: payload
        }));
    },
    handleCloseUpdateDetailModal: () => {
        set(() => ({ updateDetailModal: false }));
    },
    handleOpenUpdateDetailModal: () => {
        set(() => ({
            updateDetailModal: true
        }));
    },
    resetUpdateDetailStore: () => {
        set(initialValues);
    }
}));