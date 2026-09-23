import { Badge } from "@/shared/ui/components/badges/Badge";
import { CloudTransferItemResolutionStatusEnum } from "../../domain/enums/cloud-transfer-item-resolution-status.enum";

const LABEL: Record<CloudTransferItemResolutionStatusEnum, string> = {
    [CloudTransferItemResolutionStatusEnum.PENDING]: 'Sin resolver',
    [CloudTransferItemResolutionStatusEnum.MATCHED]: 'Emparejado',
    [CloudTransferItemResolutionStatusEnum.NEW_PRODUCT]: 'Producto nuevo',
    [CloudTransferItemResolutionStatusEnum.REJECTED]: 'Rechazado',
};

const COLOR: Record<CloudTransferItemResolutionStatusEnum, 'blue' | 'green' | 'yellow' | 'red' | 'gray' | 'purple'> = {
    [CloudTransferItemResolutionStatusEnum.PENDING]: 'yellow',
    [CloudTransferItemResolutionStatusEnum.MATCHED]: 'green',
    [CloudTransferItemResolutionStatusEnum.NEW_PRODUCT]: 'purple',
    [CloudTransferItemResolutionStatusEnum.REJECTED]: 'red',
};

interface Props {
    status: CloudTransferItemResolutionStatusEnum;
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

const ResolutionStatusBadge = ({ status, size = 'sm' }: Props) => (
    <Badge type={COLOR[status]} size={size}>{LABEL[status] ?? status}</Badge>
);

export { ResolutionStatusBadge };
