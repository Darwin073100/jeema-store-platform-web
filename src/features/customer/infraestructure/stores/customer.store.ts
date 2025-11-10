import { create } from "zustand";
import { CustomerEntity } from "../../domain/entities/customer.entity";

interface State {
    searchValue: string,
    setSearchValue: (value: string) => void,
    customers: CustomerEntity[],
    setCustomers: (customers: CustomerEntity[]) => void,
    customersFilter: CustomerEntity[],
    setCustomersFilter: (customers: CustomerEntity[]) => void,
}

const initialState = {
    searchValue: '',
    customers: [],
    customersFilter: [],
}

export const useCustomerStore = create<State>()((set, get) => ({
    ...initialState,
    setCustomers: (customers: CustomerEntity[]) => {
        set(()=>({
            customers
        }));
    },
    setCustomersFilter: (customers: CustomerEntity[]) => {
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