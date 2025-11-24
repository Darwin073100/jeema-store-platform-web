import { create } from "zustand";
import { CashRegisterEntity } from "../../domain/entities/cash-register.entity";
import { CashSessionEntity } from "../../domain/entities/cash-session.entity";

interface State {
    cashRegisterSelected    : CashRegisterEntity | null;
    setCashRegisterSelected : (state: CashRegisterEntity | null) => void;
    cashSessionSelected    : CashSessionEntity | null;
    setCashSessionSelected : (state: CashSessionEntity | null) => void;
}

const initialState = {
    cashRegisterSelected: null,
    cashSessionSelected: null,
}

export const useCashStore = create<State>()((set, get) => ({
    ...initialState,
    setCashRegisterSelected: (state: CashRegisterEntity | null)=> {
        set(()=>({
            cashRegisterSelected: state
        }));
    },
    setCashSessionSelected: (state: CashSessionEntity | null)=> {
        set(()=>({
            cashSessionSelected: state
        }));
    }
}));