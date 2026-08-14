import { EstablishmentDetailTypeEnum } from "@/contexts/establishment-management/establishment-detail/domain/enums/establishment-detail-type.enum";
import { FloatMessageType } from '@/shared/ui/types/FloatMessageType';
import { create } from 'zustand';
import { IEstablishmentDetail } from "../interfaces/IEstablishmentDetail";

type LoadingType = 'none' | 'save-establishment-detail' | 'delete-establishment-detail';
export type EstablishmentDetailModalMode = 'add' | 'edit';

interface State {
  isModalOpen: boolean;
  mode: EstablishmentDetailModalMode;
  editingDetail: IEstablishmentDetail | null;
  forcedType: EstablishmentDetailTypeEnum | null;
  loading: LoadingType;
  initLoading: (payload: LoadingType) => void;
  stopLoading: () => void;
  openModal: (
    mode: EstablishmentDetailModalMode,
    detail?: IEstablishmentDetail,
    forcedType?: EstablishmentDetailTypeEnum,
  ) => void;
  closeModal: () => void;
  floatMessageState: FloatMessageType;
  setFloatMessageState: (payload: FloatMessageType) => void;
  restore: () => void;
}

const initial = {
  isModalOpen: false,
  mode: 'add' as EstablishmentDetailModalMode,
  editingDetail: null as IEstablishmentDetail | null,
  forcedType: null as EstablishmentDetailTypeEnum | null,
  loading: 'none' as LoadingType,
  floatMessageState: {},
};

export const useEstablishmentDetailUIStore = create<State>()((set) => ({
  ...initial,
  initLoading: (payload) => {
    set(() => ({ loading: payload }));
  },
  stopLoading: () => {
    set(() => ({ loading: 'none' }));
  },
  openModal: (mode, detail, forcedType) => {
    set(() => ({
      isModalOpen: true,
      mode,
      editingDetail: detail ?? null,
      forcedType: forcedType ?? null,
    }));
  },
  closeModal: () => {
    set(() => ({ isModalOpen: false, editingDetail: null, forcedType: null }));
  },
  setFloatMessageState: (payload) => {
    set(() => ({ floatMessageState: payload }));
  },
  restore: () => {
    set(() => ({ ...initial }));
  },
}));
