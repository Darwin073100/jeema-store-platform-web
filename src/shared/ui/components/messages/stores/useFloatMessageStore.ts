import { FloatMessageType } from "@/shared/ui/types/FloatMessageType";
import { create } from "zustand";

type State = {
    //? Float Message
    floatMessageState: FloatMessageType,
    setFloatMessageState: (payload: FloatMessageType) => void,
}


export const useFloatMessageStore = create<State>()((set, get)=>({
    //? Float Message
    floatMessageState:{},
    setFloatMessageState: (payload) => set(() => ({ floatMessageState: payload })),
}));