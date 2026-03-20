
import { create } from "zustand";
import { ISuplier } from "../interfaces/ISuplier";

type State = {
    searchCharacter: string,
    setSearchCharacter: (value: string) => void,
    supliers: ISuplier[],
    supliersFiltered: ISuplier[],
    setSupliers: (value: ISuplier[])=> void,
    setSupliersFiltered: (value: ISuplier[])=> void,
    suplier: ISuplier|null,
    setSuplier: (product: ISuplier|null)=> void,
    isOpenSuplierModal: boolean,
    setOpenSuplierModal: (value:boolean)=> void
};

export const useSuplierStore = create<State>()((set, get)=>({
    searchCharacter: "",
    setSearchCharacter: (value) => set(() => ({ searchCharacter: value })),
    suplier: null,
    supliers:[],
    supliersFiltered:[],
    setSupliers(value) {
        const validProducts = Array.isArray(value) ? value : [];
        set(()=> ({supliers: validProducts}))
    },
    setSupliersFiltered(value) {
        const validProductsFiltered = Array.isArray(value) ? value : [];
        set(()=> ({supliersFiltered: validProductsFiltered}))
    },
    setSuplier: (product)=> set(()=> ({suplier: product})),
    isOpenSuplierModal: false,
    setOpenSuplierModal(value) {
        set(()=> ({isOpenSuplierModal: value}))
    },
}));