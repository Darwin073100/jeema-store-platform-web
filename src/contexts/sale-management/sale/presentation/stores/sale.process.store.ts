import { PaymentMethodEntity } from "@/features/payment-method/domain/entities/payment-method-entity"
import { create } from "zustand"
import { SalePaidsType } from "./types/sale-paids-type"
import { SaleDetailEntity } from "../../../../../features/sale/domain/entities/sale-detail-entity"
import { InventoryItemEntity } from "@/features/inventory/domain/entities/inventory-item.entity"
import { CustomerEntity } from "@/features/customer/domain/entities/customer.entity"

interface State {
    //? Payments
    paymentMethods: PaymentMethodEntity[],
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
    setPaymentMethods: (payload: PaymentMethodEntity[]) => void,
    setCustomerChange: (payload: number) => void,
    setPaidAmount: (payload: number) => void,
    setCashAmount: (payload: number) => void,
    setTransferAmount: (payload: number) => void,
    //? Update Detail
    detailSelected: null | SaleDetailEntity,
    itemMatchDetail: null| InventoryItemEntity,
    setItemMatchDetail: (payload: null| InventoryItemEntity)=> void,
    setDetailSelected: (payload: null | SaleDetailEntity)=> void,
    resetSaleProcessStore: () => void,
    //? Customer List
    customerSelected: CustomerEntity | null,
    setCustomerSelected: (payload: CustomerEntity | null)=> void,
    customers: CustomerEntity[],
    filterCustomers: CustomerEntity[],
    setFilterCustomers: (payload: CustomerEntity[])=> void,
    setCustomers: (payload: CustomerEntity[])=> void,
    //? Inventory List
    itemSelected: InventoryItemEntity | null,
    setItemSelected: (payload: InventoryItemEntity | null)=> void,
    inventoryItems: InventoryItemEntity[],
    filterInventoryItems: InventoryItemEntity[],
    setFilterInventoryItems: (items: InventoryItemEntity[])=> void,
    setInventoryItems: (items: InventoryItemEntity[])=> void,
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
    setPaymentMethods: (payload: PaymentMethodEntity[]) => {
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
    setItemMatchDetail: (payload: null| InventoryItemEntity)=>{
        set(()=>({
            itemMatchDetail: payload
        }));
    },
    setDetailSelected: (payload: null | SaleDetailEntity)=>{
        set(()=>({
            detailSelected: payload
        }));
    },
    //? Customer List
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
    //? Inventory List
    inventoryItems:[],
    setItemSelected: (payload: InventoryItemEntity | null)=> {
        const prev = get().itemSelected;
        set(()=>({
            itemSelected: prev?.inventoryItemId !== payload?.inventoryItemId? payload: null 
        }));
    },
    setFilterInventoryItems: (items: InventoryItemEntity[])=>{
        set(()=>({
            filterInventoryItems: items
        }));
    },
    setInventoryItems: (items: InventoryItemEntity[])=>{
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