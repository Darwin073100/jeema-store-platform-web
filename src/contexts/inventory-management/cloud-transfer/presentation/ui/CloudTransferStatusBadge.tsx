import { Badge } from "@/shared/ui/components/badges/Badge";
import { CloudTransferStatusEnum } from "../../domain/enums/cloud-transfer-status.enum";

const STATUS_LABEL: Record<CloudTransferStatusEnum, string> = {
    [CloudTransferStatusEnum.PENDING]: 'Pendiente',
    [CloudTransferStatusEnum.IN_TRANSIT]: 'En tránsito',
    [CloudTransferStatusEnum.RECEIVED]: 'Recibida',
    [CloudTransferStatusEnum.APPROVED]: 'Aprobada',
    [CloudTransferStatusEnum.CANCELLED]: 'Cancelada',
    [CloudTransferStatusEnum.ERROR]: 'Error',
};

const STATUS_COLOR: Record<CloudTransferStatusEnum, 'blue' | 'green' | 'yellow' | 'red' | 'gray' | 'purple'> = {
    [CloudTransferStatusEnum.PENDING]: 'yellow',
    [CloudTransferStatusEnum.IN_TRANSIT]: 'blue',
    [CloudTransferStatusEnum.RECEIVED]: 'purple',
    [CloudTransferStatusEnum.APPROVED]: 'green',
    [CloudTransferStatusEnum.CANCELLED]: 'gray',
    [CloudTransferStatusEnum.ERROR]: 'red',
};

interface Props {
    status: CloudTransferStatusEnum;
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

const CloudTransferStatusBadge = ({ status, size = 'sm' }: Props) => (
    <Badge type={STATUS_COLOR[status]} size={size}>{STATUS_LABEL[status] ?? status}</Badge>
);

export { CloudTransferStatusBadge };
