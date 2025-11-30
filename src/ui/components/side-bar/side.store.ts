import { create } from "zustand";

type Store = {
    sideBar: boolean,
    onToggelSideBar: ()=> void,
    openSideBar: ()=> void,
    closeSideBar: ()=> void,
}

const initialState = {
    sideBar: false,
}

export const useSideStore = create<Store>()((set, get) => ({
    ...initialState,
    openSideBar() {
        set(()=> ({sideBar: true}));
    },
    onToggelSideBar() {
        set(()=> ({sideBar: !get().sideBar}));
    },
    closeSideBar() {
        set(()=> ({sideBar: false}));
    },
    resetModals          : () => set(initialState),
}));