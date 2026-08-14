import { EstablishmentDetailTypeEnum } from "src/contexts/establishment-management/establishment-detail/domain/enums/establishment-detail-type.enum";

export interface IEstablishmentDetail {
  establishmentDetailId: bigint;
  establishmentId: bigint;
  type: EstablishmentDetailTypeEnum;
  value: string;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date | null;
  deletedAt: Date | null;
}
