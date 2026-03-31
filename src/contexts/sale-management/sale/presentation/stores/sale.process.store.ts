import { create } from "zustand"
import { SalePaidsType } from "./types/sale-paids-type"
import { IPaymentMethod } from "@/contexts/sale-management/payment-method/presentation/interfaces/IPaymentMethod";
import { ISaleDetail } from "@/contexts/sale-management/sale-detail/presentation/interfaces/ISaleDetail";
import { IInventoryItem } from "@/contexts/inventory-management/inventory-item/presentation/interfaces/IInventoryItem";
import { ICustomer } from "@/contexts/sale-management/customer/presentation/interfaces/ICustomer";

interface State {
    //? Payments
    paymentMethods: IPaymentMethod[],
    cashAmount: number,
    transferAmount: number,
    transferNumberRef: string,
    paidAmount: number,
    customerChange: number,
    paids: SalePaidsType,
    setTransferNumberRef: (payload: string) => void,
    setPaids: (paids: SalePaidsType) => void,
    handleTogglePaidCash: () => void,
    handleTogglePaidTransfer: () => void,
    setPaymentMethods: (payload: IPaymentMethod[]) => void,
    setCustomerChange: (payload: number) => void,
    setPaidAmount: (payload: number) => void,
    setCashAmount: (payload: number) => void,
    setTransferAmount: (payload: number) => void,
    //? Update Detail
    detailSelected: null | ISaleDetail,
    itemMatchDetail: null| IInventoryItem,
    setItemMatchDetail: (payload: null| IInventoryItem)=> void,
    setDetailSelected: (payload: null | ISaleDetail)=> void,
    resetSaleProcessStore: () => void,
    //? Customer List
    customerSelected: ICustomer | null,
    setCustomerSelected: (payload: ICustomer | null)=> void,
    customers: ICustomer[],
    filterCustomers: ICustomer[],
    setFilterCustomers: (payload: ICustomer[])=> void,
    setCustomers: (payload: ICustomer[])=> void,
    //? Inventory List
    itemSelected: IInventoryItem | null,
    setItemSelected: (payload: IInventoryItem | null)=> void,
    inventoryItems: IInventoryItem[],
    filterInventoryItems: IInventoryItem[],
    setFilterInventoryItems: (items: IInventoryItem[])=> void,
    setInventoryItems: (items: IInventoryItem[])=> void,
    //? Product Quantity
    productQuantity: number,
    setProductQuantity: (total: number)=> void,
}

const initialValues = {
    //? Payments
    cashAmount: 0,
    transferAmount: 0,
    transferNumberRef: '',
    paidAmount: 0,
    customerChange: 0,
    paids: {
        paidCash: false,
        paidTransfer: false
    },
    //? Update Detail
    detailSelected: null,
    itemMatchDetail: null,
    //? Customer List
    filterCustomers: [],
    customerSelected: null,
    //? Inventory List
    filterInventoryItems: [],
    itemSelected: null,
    //? Product Quantity
    productQuantity: 0,
}

export const useSaleProcessStore = create<State>()((set, get) => ({
    ...initialValues,
    //? Payments
    paymentMethods: [],
    setTransferNumberRef(payload: string) {
        set(() => ({
            transferNumberRef: payload
        }));
    },
    handleTogglePaidCash: () => {
        const prevPaids = get().paids;
        set(() => ({
            paids: {
                ...prevPaids,
                paidCash: !prevPaids.paidCash
            }
        }));
    },
    handleTogglePaidTransfer: () => {
        const prevPaids = get().paids;
        set(() => ({
            paids: {
                ...prevPaids,
                paidTransfer: !prevPaids.paidTransfer
            }
        }));

    },
    setPaids: (paids: SalePaidsType) => {
        set(() => ({
            paids
        }))
    },
    setPaymentMethods: (payload: IPaymentMethod[]) => {
        set(() => ({
            paymentMethods: payload
        }));
    },
    setCustomerChange: (payload: number) => {
        set(() => ({
            customerChange: payload
        }));
    },
    setCashAmount: (payload: number) => {
        set(() => ({
            cashAmount: payload
        }));
    },
    setTransferAmount: (payload: number) => {
        set(() => ({
            transferAmount: payload
        }));
    },
    setPaidAmount: (payload: number) => {
        set(() => ({
            paidAmount: payload
        }));
    },
    //? Update Detail
    setItemMatchDetail: (payload: null| IInventoryItem)=>{
        set(()=>({
            itemMatchDetail: payload
        }));
    },
    setDetailSelected: (payload: null | ISaleDetail)=>{
        set(()=>({
            detailSelected: payload
        }));
    },
    //? Customer List
    customers:[],
    setCustomerSelected: (payload: ICustomer | null)=> {
        const prev = get().customerSelected;
        set(()=>({
            customerSelected: prev?.customerId !== payload?.customerId? payload: null 
        }));
    },
    setFilterCustomers: (payload: ICustomer[])=>{
        set(()=>({
            filterCustomers: payload
        }));
    },
    setCustomers: (payload: ICustomer[])=>{
        set(()=>({
            customers: payload
        }));
    },
    //? Inventory List
    inventoryItems:[],
    setItemSelected: (payload: IInventoryItem | null)=> {
        const prev = get().itemSelected;
        set(()=>({
            itemSelected: prev?.inventoryItemId !== payload?.inventoryItemId? payload: null 
        }));
    },
    setFilterInventoryItems: (items: IInventoryItem[])=>{
        set(()=>({
            filterInventoryItems: items
        }));
    },
    setInventoryItems: (items: IInventoryItem[])=>{
        set(()=>({
            inventoryItems: items
        }));
    },
    //? Product Quantity
    setProductQuantity: (quantity: number)=>{
        set(()=>({
            productQuantity: quantity
        }));
    },
    //? Reset Store
    resetSaleProcessStore: () => {
        set(initialValues);
    }
}))