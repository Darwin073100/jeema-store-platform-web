import { create } from "zustand";
import { ICategory } from "@/contexts/product-management/category/presentation/interfaces/ICategory";


type State = {
    modalOpen: boolean;
    category: ICategory | null;
    categories: ICategory[];
    setCategory: (entity: ICategory|null)=> void
    setModalOpen: (open: boolean) => void;
    setCategories: (categories: ICategory[]) => void;
    addCategory: (category: ICategory) => void;
    updateCategory: (updatedCategory: ICategory) => void;
    removeCategory: (categoryId: bigint) => void;
}

export const useCategoryStore = create<State>()((set, get) => ({
    modalOpen: false,
    categories: [],
    category: null,
    setModalOpen: (open) => set(() => ({ modalOpen: open })),
    setCategories: (categories) => set(() => ({ categories })),
    addCategory: (category) => set((state) => ({
        categories: [...state.categories, category]
    })),
    updateCategory: (updatedCategory) => set((state) => ({
        categories: state.categories.map(category => 
            category.categoryId === updatedCategory.categoryId ? updatedCategory : category
        )
    })),
    removeCategory: (categoryId) => set((state) => ({
        categories: state.categories.filter(category => category.categoryId !== categoryId)
    })),
    setCategory: (category) => set(()=> ({
        category
    })),
}));