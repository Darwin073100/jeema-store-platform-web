import { create } from 'zustand';
import { IEstablishment } from '../interfaces/IEstablishment';

interface State{
    establishment: IEstablishment | null
    setEstablishment: (data: IEstablishment | null) => void;
    restore:()=> void;
}

const initial = {
  establishment: null,
}

export const useEstablishmentNoStorageStore = create<State>()((set, get)=>({
  ...initial,
  setEstablishment: (payload)=> {
    set(()=>({establishment: payload}))
  },
  restore: ()=> {
    set(()=>({...initial}))
  }
}));