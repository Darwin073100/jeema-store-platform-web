import { create } from "zustand";
import { ICashSession } from "../interfaces/ICashSession";
import { ICashRegister } from "@/contexts/cash-management/cash-register/presentation/interfaces/ICashRegister";

interface State {
    cashSessions: ICashSession[],
    setCashSessions: (entities: ICashSession[])=> void,
    dateInit: Date | null,
    dateFinish: Date | null,
    setDateInit: (date: Date | null)=> void,
    setDateFinish: (date: Date | null)=> void,
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
    cashRegisterSelected    : ICashRegister | null;
    setCashRegisterSelected : (state: ICashRegister | null) => void;
    cashSessionSelected    : ICashSession | null;
    setCashSessionSelected : (state: ICashSession | null) => void;
}

const initialState = {
    cashRegisterSelected: null,
    cashSessionSelected: null,
    diference: 0,
    totalIn: 0,
    totalOut: 0,
    totalClose: 0,
    startBalance: 0,
    cashSessions: [],
    dateInit: null,
    dateFinish: null,
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
    setCashRegisterSelected: (state: ICashRegister | null)=> {
        set(()=>({
            cashRegisterSelected: state
        }));
    },
    setCashSessionSelected: (state: ICashSession | null)=> {
        set(()=>({
            cashSessionSelected: state
        }));
    },
    setDiference: (payload: number)=> {
        set(()=>({diference: payload}));
    },
    setCashSessions(entities) {
        set(()=>({
            cashSessions: entities
        }));
    },
    setDateInit(date) {
        set(()=>({
            dateInit: date
        }));
    },
    setDateFinish(date) {
        set(()=>({
            dateFinish: date
        }));
    },
}));