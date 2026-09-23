import { FloatMessageType } from "@/shared/ui/types/FloatMessageType";
import { create } from "zustand";
import { CloudTransferDirectionEnum } from "../../domain/enums/cloud-transfer-direction.enum";

type ResolutionModalType = 'relink' | 'category' | 'reject' | 'none';
type LoadingType =
    | 'listing'
    | 'refreshing'
    | 'creating'
    | 'retrying-send'
    | 'starting-processing'
    | 'receiving'
    | 'approving'
    | 'cancelling'
    | 'reporting-error'
    | 'resolving-item'
    | 'none';

type State = {
    //? Lista
    listTab: CloudTransferDirectionEnum,
    setListTab: (tab: CloudTransferDirectionEnum) => void,
    //? Modal de resolución de item (dentro del detalle)
    resolutionModal: ResolutionModalType,
    resolutionItemId: bigint | null,
    openResolutionModal: (type: ResolutionModalType, cloudTransferItemId: bigint) => void,
    closeResolutionModal: () => void,
    //? Loading
    cloudTransferLoading: LoadingType,
    runCloudTransferLoading: (type: LoadingType) => void,
    stopCloudTransferLoading: () => void,
    //? Float Message
    floatMessageState: FloatMessageType,
    setFloatMessageState: (payload: FloatMessageType) => void,
}

export const useCloudTransferUIStore = create<State>()((set) => ({
    //? Lista
    listTab: CloudTransferDirectionEnum.INCOMING,
    setListTab: (tab) => set(() => ({ listTab: tab })),
    //? Modal de resolución
    resolutionModal: 'none',
    resolutionItemId: null,
    openResolutionModal: (type, cloudTransferItemId) => set(() => ({ resolutionModal: type, resolutionItemId: cloudTransferItemId })),
    closeResolutionModal: () => set(() => ({ resolutionModal: 'none', resolutionItemId: null })),
    //? Loading
    cloudTransferLoading: 'none',
    runCloudTransferLoading: (type) => set(() => ({ cloudTransferLoading: type })),
    stopCloudTransferLoading: () => set(() => ({ cloudTransferLoading: 'none' })),
    //? Float Message
    floatMessageState: {},
    setFloatMessageState: (payload) => set(() => ({ floatMessageState: payload })),
}));
