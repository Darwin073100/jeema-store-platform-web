
import { create } from "zustand";
import { IProduct } from "@/contexts/product-management/product/presentation/interfaces/IProduct";

type State = {
    lowStock: boolean;
    setLowStock: (lowStock: boolean)=> void,
    searchCharacter: string,
    setSearchCharacter: (value: string) => void,
    products: IProduct[]|[],
    productsFiltered: IProduct[]|[],
    setProducts: (value: IProduct[])=> void,
    setProductsFiltered: (value: IProduct[])=> void,
    product: IProduct|null,
    setProduct: (product: IProduct|null)=> void,
    isOpenProductModal: boolean,
    setOpenProductModal: (value:boolean)=> void
};

export const useProductStore = create<State>()((set, get)=>({
    searchCharacter: "",
    lowStock: false,
    setLowStock: (lowStock: boolean)=> {
        set(()=>({
            lowStock
        }));
    },
    setSearchCharacter: (value) => set(() => ({ searchCharacter: value })),
    product: null,
    products:[],
    productsFiltered:[],
    setProducts(value) {
        const validProducts = Array.isArray(value) ? value : [];
        set(()=> ({products: validProducts}))
    },
    setProductsFiltered(value) {
        const validProductsFiltered = Array.isArray(value) ? value : [];
        set(()=> ({productsFiltered: validProductsFiltered}))
    },
    setProduct: (product)=> set(()=> ({product})),
    isOpenProductModal: false,
    setOpenProductModal(value) {
        set(()=> ({isOpenProductModal: value}))
    },
}));