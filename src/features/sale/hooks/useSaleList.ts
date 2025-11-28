import { SaleStatusEnum } from "../domain/enums/sale-status.enum";

const useSaleListBranch = () => {
    const handleBadgeType = (status: SaleStatusEnum) => {
        switch (status) {
            case SaleStatusEnum.COMPLETED: return 'green';
            case SaleStatusEnum.PENDING: return 'yellow';
            case SaleStatusEnum.REFUNDED: return 'gray';
            case SaleStatusEnum.CANCELLED: return 'red';
            case SaleStatusEnum.INITIALIZED: return 'blue';
            default: return 'blue';
        }
    }
    return {
        handleBadgeType,
    }
}

export { useSaleListBranch };
