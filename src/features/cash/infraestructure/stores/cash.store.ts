import { FloatMessageType } from "@/shared/ui/types/FloatMessageType";
import { create } from "zustand";
import { CashRegisterEntity } from "../../domain/entities/cash-register.entity";

interface State {
    cashRegisterSelected    : CashRegisterEntity | null;
    setCashRegisterSelected : (state: CashRegisterEntity | null) => void;
}

const initialState = {
    cashRegisterSelected: null,
}

export const useCashStore = create<State>()((set, get) => ({
    ...initialState,
    setCashRegisterSelected: (state: CashRegisterEntity | null)=> {
        set(()=>({
            cashRegisterSelected: state
        }));
    }
}));