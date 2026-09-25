import { SaleStatusEnum } from "../../domain/enums/sale-status.enum";
import { getSaleStatusBadge } from "../utils/sale-status-badge";

const useSaleListBranch = () => {
    const handleBadgeType = (status: SaleStatusEnum) => {
        return getSaleStatusBadge(status).color;
    }
    return {
        handleBadgeType,
    }
}

export { useSaleListBranch };
