import { create } from "zustand";
import { LotEntity } from "../../domain/entities/lot.entity";
import { ILot } from "@/contexts/purchase-management/lot/presentation/interfaces/ILot";

type State = {
    searchCharacter: string,
    setSearchCharacter: (payload: string)=> void,
    lots: ILot[]|[],
    lotsFiltered: ILot[]|[],
    setLots: (value: ILot[])=> void,
    setLotsFiltered: (value: ILot[])=> void,
    lot: ILot|null,
    setLot: (lot: ILot|null)=> void,
    openModal: boolean,
    setOpenModal: (value:boolean)=> void
};

export const useLotStore = create<State>()((set, get)=>({
    searchCharacter: "",
    setSearchCharacter: (payload)=>{
        set(()=>({searchCharacter: payload}));
    },
    lot: null,
    lots:[],
    lotsFiltered:[],
    setLots(value) {
        set(()=> ({lots: value}))
    },
    setLotsFiltered(value) {
        set(()=> ({lotsFiltered: value}))
    },
    setLot: (lot)=> set(()=> ({lot})),
    openModal: false,
    setOpenModal(value) {
        set(()=> ({openModal: value}))
    },
}));