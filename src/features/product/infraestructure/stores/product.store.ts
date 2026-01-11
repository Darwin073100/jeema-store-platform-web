
import { create } from "zustand";
import { ProductEntity } from "../../domain/entities/product.entity";

type State = {
    lowStock: boolean;
    setLowStock: (lowStock: boolean)=> void,
    searchCharacter: string,
    setSearchCharacter: (value: string) => void,
    products: ProductEntity[]|[],
    productsFiltered: ProductEntity[]|[],
    setProducts: (value: ProductEntity[])=> void,
    setProductsFiltered: (value: ProductEntity[])=> void,
    product: ProductEntity|null,
    setProduct: (product: ProductEntity|null)=> void,
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