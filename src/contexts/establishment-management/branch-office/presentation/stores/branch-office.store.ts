import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { IBranchOffice } from '../interfaces/IBranchOffice';

interface State{
    branchOffice?: IBranchOffice
    setBranchOffice: (data: IBranchOffice) => void;
    clearBranchOffice:()=> void;
}

export const useBranchOfficeStore = create<State>()(
    persist(
      (set) => ({
        branchOffice: undefined,
        setBranchOffice: (data) => set({ branchOffice: data }),
        clearBranchOffice: () => set({ branchOffice: undefined }),
      }),
      {
        name: 'branch-office-storage', // clave que usará en localStorage
      }
    )
  );