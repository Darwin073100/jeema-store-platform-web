import { FloatMessageType } from '@/shared/ui/types/FloatMessageType';
import { create } from 'zustand';
type LoadingType = 'none' | 'update-establishment';
type ModalType = 'none' | 'update-establishment';
interface State{
  loading: LoadingType;
  initLoading: (payload: LoadingType)=> void;
  stopLoading: ()=> void;
  establishmentModal: ModalType;
  openEstablishmentModal: (payload: ModalType)=> void;
  closeEstablishmentModal: ()=> void;
  floatMessageState: FloatMessageType,
  setFloatMessageState: (payload: FloatMessageType)=> void,
  restore: ()=> void;
}

const initial = {
  loading: 'none' as LoadingType,
  establishmentModal: 'none' as ModalType,
  floatMessageState: {},
}

export const useEstablishmentUIStore = create<State>()((set, get)=>({
  ...initial,
  initLoading(payload) {
    set(()=>({loading: payload}))
  },
  stopLoading: ()=>{
    set(()=>({loading: 'none'}))
  },
  closeEstablishmentModal: ()=> {
    set(()=>({establishmentModal: 'none'}))
  },
  openEstablishmentModal: (payload)=>{ 
    set(()=>({establishmentModal: payload}))
  },
  setFloatMessageState: (payload)=> {
    set(()=>({floatMessageState: payload}))
  },
  restore: ()=> {
    set(()=>({...initial}))
  }
}));