import { create } from "zustand";
import { LotEntity } from "../../domain/entities/lot.entity";

type State = {
    searchCharacter: string,
    setSearchCharacter: (payload: string)=> void,
    lots: LotEntity[]|[],
    lotsFiltered: LotEntity[]|[],
    setLots: (value: LotEntity[])=> void,
    setLotsFiltered: (value: LotEntity[])=> void,
    lot: LotEntity|null,
    setLot: (lot: LotEntity|null)=> void,
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