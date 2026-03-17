import { IBrand } from "@/contexts/product-management/brand/presentation/interfaces/Ibrand";
import { create } from "zustand";


type State = {
    modalOpen: boolean;
    brands: IBrand[];
    brand: IBrand| null;
    setBrand: (brand: IBrand|null) => void;
    setModalOpen: (open: boolean) => void;
    setBrands: (brands: IBrand[]) => void;
    addBrand: (brand: IBrand) => void;
    updateBrand: (brand: IBrand) => void;
    removeBrand: (brandId: bigint) => void;
}

export const useBrandStore = create<State>()((set, get) => ({
    modalOpen: false,
    brands: [],
    brand: null,
    setBrand:(brand)=> set(()=>({brand})),
    setModalOpen: (open) => set(() => ({ modalOpen: open })),
    setBrands: (brands) => set(() => ({ brands })),
    addBrand: (brand) => set((state) => ({
        brands: [...state.brands, brand]
    })),
    updateBrand: (updatedBrand) => set((state) => ({
        brands: state.brands.map(brand => 
            brand.brandId === updatedBrand.brandId ? updatedBrand : brand
        )
    })),
    removeBrand: (brandId) => set((state) => ({
        brands: state.brands.filter(brand => brand.brandId !== brandId)
    }))
}));