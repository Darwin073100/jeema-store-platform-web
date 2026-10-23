import React from 'react'
import { useKeyDown } from '@/shared/ui/hooks/useKeyDown';
import { useRouter } from 'next/navigation';
import { useSaleStore } from '../stores/sale.store';
import { useInventoryListModal } from './useInventoryListModal';
import { useCancelSale } from './useCancelSale';
import { ICashSession } from '@/contexts/cash-management/cash-session/presentation/interfaces/ICashSession';
interface Props {
    cashSession: ICashSession | null;
}
export const useSaleProductList = ({ cashSession}:Props) => {
    const router = useRouter();
    const { sale } = useSaleStore();
    const { openSaleModal } = useInventoryListModal();
    const { handleCheckerOpenModalCancelSale } = useCancelSale();
    
    const viewCashSession = () => {
        if (cashSession) {
            router.push(`/cash/session/${cashSession.cashSessionId.toString()}`)
        }
    }
    
    useKeyDown({
        F4: () => openSaleModal('inventoryListModal'),
        F5: () => viewCashSession(),
        F6: () => handleCheckerOpenModalCancelSale()
    })

    return {
        sale,
        openSaleModal,
        handleCheckerOpenModalCancelSale,
        viewCashSession
    }
}
