import { CustomerEntity } from "@/features/customer/domain/entities/customer.entity"
import { InventoryItemEntity } from "@/features/inventory/domain/entities/inventory-item.entity"
import { create } from "zustand"


type State = {
    customerSelected: CustomerEntity | null,
    setCustomerSelected: (payload: CustomerEntity | null)=> void,
    customers: CustomerEntity[],
    filterCustomers: CustomerEntity[],
    setFilterCustomers: (payload: CustomerEntity[])=> void,
    setCustomers: (payload: CustomerEntity[])=> void,
    modalCustomerList: boolean,
    openModalCustomerList: ()=> void,
    closeModalCustomerList: ()=> void
}

const initialValues = {
    modalCustomerList: false,
    filterCustomers: [],
    customerSelected: null,
}

export const useSaleCustomerListStore = create<State>()((set, get)=>({
    ...initialValues,
    customers:[],
    setCustomerSelected: (payload: CustomerEntity | null)=> {
        const prev = get().customerSelected;
        set(()=>({
            customerSelected: prev?.customerId !== payload?.customerId? payload: null 
        }));
    },
    setFilterCustomers: (payload: CustomerEntity[])=>{
        set(()=>({
            filterCustomers: payload
        }));
    },
    setCustomers: (payload: CustomerEntity[])=>{
        set(()=>({
            customers: payload
        }));
    },
    closeModalCustomerList: ()=>{
        set(()=>({ modalCustomerList: false}));
    },
    openModalCustomerList: ()=> {
        set(()=>({ modalCustomerList: true}));
    },

    resetSaleStore: ()=> {
        set(initialValues);
    }
}));