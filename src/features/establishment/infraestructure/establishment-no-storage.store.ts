import { create } from 'zustand';
import { EstablishmentEntity } from '../domain/entities/establishment.entity';

interface State{
    establishment: EstablishmentEntity | null
    setEstablishment: (data: EstablishmentEntity | null) => void;
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