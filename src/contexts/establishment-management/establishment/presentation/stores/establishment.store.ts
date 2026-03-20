import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { EstablishmentEntity } from '../../../../../features/establishment/domain/entities/establishment.entity';

interface State{
    establishment?: EstablishmentEntity
    setEstablishment: (data: EstablishmentEntity) => void;
    clearEstablishment:()=> void;
}

export const useEstablishmentStore = create<State>()(
    persist(
      (set) => ({
        establishment: undefined,
        setEstablishment: (data) => set({ establishment: data }),
        clearEstablishment: () => set({ establishment: undefined }),
      }),
      {
        name: 'establishment-storage', // clave que usará en localStorage
      }
    )
);