import { create } from "zustand";
import { ICustomer } from "../interfaces/ICustomer";

interface State {
    customer: ICustomer | null,
    setCustomer: (payload: ICustomer | null)=> void,
    searchValue: string,
    setSearchValue: (value: string) => void,
    customers: ICustomer[],
    setCustomers: (customers: ICustomer[]) => void,
    customersFilter: ICustomer[],
    setCustomersFilter: (customers: ICustomer[]) => void,
}

const initialState = {
    searchValue: '',
    customers: [],
    customersFilter: [],
    customer: null,
}

export const useCustomerStore = create<State>()((set, get) => ({
    ...initialState,
    setCustomer: (payload: ICustomer | null)=> {
        set(()=>({
            customer: payload
        }))
    },
    setCustomers: (customers: ICustomer[]) => {
        set(()=>({
            customers
        }));
    },
    setCustomersFilter: (customers: ICustomer[]) => {
        set(()=>({
            customersFilter: customers
        }));
    },
    setSearchValue: (value: string) => {
        set(()=>({
            searchValue: value
        }));
    }
}));