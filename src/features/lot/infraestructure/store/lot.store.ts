
import { create } from "zustand";
import { LotEntity } from "../../domain/entities/lot.entity";

type State = {
    searchCharacter: string,
    lots: LotEntity[]|[],
    setLots: (value: LotEntity[])=> void,
    lot: LotEntity|null,
    setLot: (lot: LotEntity|null)=> void,
    openModal: boolean,
    setOpenModal: (value:boolean)=> void
};

export const useLotStore = create<State>()((set, get)=>({
    searchCharacter: "",
    lot: null,
    lots:[],
    setLots(value) {
        set(()=> ({lots: value}))
    },
    setLot: (lot)=> set(()=> ({lot})),
    openModal: false,
    setOpenModal(value) {
        set(()=> ({openModal: value}))
    },
}));