
import { create } from "zustand";
import { SuplierEntity } from "../../domain/entities/suplier.entity";

type State = {
    searchCharacter: string,
    setSearchCharacter: (value: string) => void,
    supliers: SuplierEntity[],
    supliersFiltered: SuplierEntity[],
    setSupliers: (value: SuplierEntity[])=> void,
    setSupliersFiltered: (value: SuplierEntity[])=> void,
    suplier: SuplierEntity|null,
    setSuplier: (product: SuplierEntity|null)=> void,
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