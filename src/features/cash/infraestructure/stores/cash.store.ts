import { create } from "zustand";
import { CashRegisterEntity } from "../../domain/entities/cash-register.entity";
import { CashSessionEntity } from "../../domain/entities/cash-session.entity";

interface State {
    totalIn: number,
    totalOut: number,
    totalClose: number,
    startBalance: number,
    setStartBalance: (payload: number)=>void,
    setTotalIn: (payload: number)=> void,
    setTotalOut: (payload: number)=> void,
    setTotalClose: (payload: number)=> void,
    diference: number,
    setDiference: (payload: number)=> void,
    cashRegisterSelected    : CashRegisterEntity | null;
    setCashRegisterSelected : (state: CashRegisterEntity | null) => void;
    cashSessionSelected    : CashSessionEntity | null;
    setCashSessionSelected : (state: CashSessionEntity | null) => void;
}

const initialState = {
    cashRegisterSelected: null,
    cashSessionSelected: null,
    diference: 0,
    totalIn: 0,
    totalOut: 0,
    totalClose: 0,
    startBalance: 0,
}

export const useCashStore = create<State>()((set, get) => ({
    ...initialState,
    setTotalClose(payload) {
        set(()=>({totalClose: payload}));
    },
    setStartBalance: (payload: number)=>{
        set(()=> ({startBalance: payload}));
    },
    setTotalIn(payload) {
        set(()=> ({totalIn: payload}));
    },
    setTotalOut(payload) {
        set(()=> ({totalOut: payload}));
    },
    setCashRegisterSelected: (state: CashRegisterEntity | null)=> {
        set(()=>({
            cashRegisterSelected: state
        }));
    },
    setCashSessionSelected: (state: CashSessionEntity | null)=> {
        set(()=>({
            cashSessionSelected: state
        }));
    },
    setDiference: (payload: number)=> {
        set(()=>({diference: payload}));
    }
}));