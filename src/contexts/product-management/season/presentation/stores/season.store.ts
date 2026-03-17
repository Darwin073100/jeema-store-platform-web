import { ISeason } from "@/contexts/product-management/season/presentation/interfaces/ISeason";
import { create } from "zustand";


type State = {
    modalOpen: boolean;
    seasons: ISeason[];
    season: ISeason | null;
    setSeason: (season: ISeason|null)=>void;
    setModalOpen: (open: boolean) => void;
    setSeasons: (seasons: ISeason[]) => void;
    addSeason: (season: ISeason) => void;
    updateSeason: (updatedSeason: ISeason) => void;
    removeSeason: (seasonId: bigint) => void;
}

export const useSeasonStore = create<State>()((set, get) => ({
    modalOpen: false,
    seasons: [],
    season: null,
    setSeason: (season)=> set(()=>({season})),
    setModalOpen: (open) => set(() => ({ modalOpen: open })),
    setSeasons: (seasons) => set(() => ({ seasons: seasons })),
    addSeason: (season) => set((state) => ({
        seasons: [...state.seasons, season]
    })),
    updateSeason: (updatedSeason) => set((state) => ({
        seasons: state.seasons.map(season => 
            season.seasonId === updatedSeason.seasonId ? updatedSeason : season
        )
    })),
    removeSeason: (seasonId) => set((state) => ({
        seasons: state.seasons.filter(season => season.seasonId !== seasonId)
    }))
}));