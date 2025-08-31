import { create } from "zustand"
import { LotUnitPurchaseEntity } from "../../domain/entities/lot-unit-purchase.entity"

type State = {
    lotUnitPurchase: LotUnitPurchaseEntity|null,
    selectedLotId: bigint|null,
    setSelectedLotId: (lotId: bigint|null) => void,
    setLotUnitPurchase: (lot: LotUnitPurchaseEntity | null)=> void,
    saveIsOpenModal: boolean,
    handleOpenSaveIsOpenModal: ()=> void,
    handlecloseSaveIsOpenModal: ()=> void,
}

export const useSaveLotUnitPurchaseStore = create<State>()((set, get)=>({
    lotUnitPurchase: null,
    saveIsOpenModal: false,
    selectedLotId: null,
    setSelectedLotId(lotId) {
        set({selectedLotId: lotId})
    },
    setLotUnitPurchase: (unit)=>set({lotUnitPurchase: unit}),
    handleOpenSaveIsOpenModal: ()=> set({saveIsOpenModal: true }),
    handlecloseSaveIsOpenModal: ()=> set({saveIsOpenModal: false })
}))