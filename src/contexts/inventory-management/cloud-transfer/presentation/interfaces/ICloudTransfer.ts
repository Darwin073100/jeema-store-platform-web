import { CloudTransferDirectionEnum } from "../../domain/enums/cloud-transfer-direction.enum";
import { CloudTransferStatusEnum } from "../../domain/enums/cloud-transfer-status.enum";
import { ICloudTransferItem } from "./ICloudTransferItem";

/** View-model cliente, cabecera. Espeja 1:1 los getters de `CloudTransferEntity`. */
export class ICloudTransfer {
    cloudTransferId: bigint;
    remoteCloudTransferId: bigint | null;
    direction: CloudTransferDirectionEnum;
    fromBranchOfficeId: bigint | null;
    fromCloudBranchOfficeId: bigint;
    toBranchOfficeId: bigint | null;
    toCloudBranchOfficeId: bigint;
    status: CloudTransferStatusEnum;
    shipmentNotes: string | null;
    resolutionNotes: string | null;
    errorMessage: string | null;
    requestedByEmployeeId: bigint | null;
    processedByEmployeeId: bigint | null;
    lastSyncedAt: Date | null;
    createdAt: Date;
    updatedAt: Date | null;
    items: ICloudTransferItem[];
}
