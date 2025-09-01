import { create } from "zustand"
import { LotUnitPurchaseEntity } from "../../domain/entities/lot-unit-purchase.entity"

type State = {
    lotUnitPurchase: LotUnitPurchaseEntity|null,
    setLotUnitPurchase: (lot: LotUnitPurchaseEntity | null)=> void,
    updateIsOpenModal: boolean,
    handleUpdateOpenIsOpenModal: ()=> void,
    handlecloseUpdateIsOpenModal: ()=> void,
}

export const useUpdateLotUnitPurchaseStore = create<State>()((set, get)=>({
    lotUnitPurchase: null,
    updateIsOpenModal: false,
    setLotUnitPurchase: (unit)=>set({lotUnitPurchase: unit}),
    handleUpdateOpenIsOpenModal: ()=> set({updateIsOpenModal: true }),
    handlecloseUpdateIsOpenModal: ()=> set({updateIsOpenModal: false })
}))