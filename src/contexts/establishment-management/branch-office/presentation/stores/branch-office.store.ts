import { create } from "zustand";
import { IBranchOffice } from "../interfaces/IBranchOffice";

interface State {
    branchOffice: IBranchOffice | null,
    setBranchOffice: (payload: IBranchOffice | null)=> void,
    searchValue: string,
    setSearchValue: (value: string) => void,
    branchOffices: IBranchOffice[],
    setBranchOffices: (branchOffices: IBranchOffice[]) => void,
    branchOfficesFilter: IBranchOffice[],
    setBranchOfficesFilter: (branchOffices: IBranchOffice[]) => void,
}

const initialState = {
    searchValue: '',
    branchOffices: [],
    branchOfficesFilter: [],
    branchOffice: null,
}

export const useBranchOfficeStore = create<State>()((set, get) => ({
    ...initialState,
    setBranchOffice: (payload: IBranchOffice | null)=> {
        set(()=>({
            branchOffice: payload
        }))
    },
    setBranchOffices: (branchOffices: IBranchOffice[]) => {
        set(()=>({
            branchOffices
        }));
    },
    setBranchOfficesFilter: (branchOffices: IBranchOffice[]) => {
        set(()=>({
            branchOfficesFilter: branchOffices
        }));
    },
    setSearchValue: (value: string) => {
        set(()=>({
            searchValue: value
        }));
    }
}));