import { useCallback, useEffect, useRef, useState } from 'react'
import { useKeyDown } from '@/shared/ui/hooks/useKeyDown';
import { useRouter } from 'next/navigation';
import { useSaleStore } from '../stores/sale.store';
import { useSaleUIStore } from '../stores/sale.ui.store';
import { useSaleProcessStore } from '../stores/sale.process.store';
import { useCancelSale } from './useCancelSale';
import { ICashSession } from '@/contexts/cash-management/cash-session/presentation/interfaces/ICashSession';
import { ISaleDetail } from '@/contexts/sale-management/sale-detail/presentation/interfaces/ISaleDetail';
import { findLastAddedDetail } from '../utils/sale-detail';

/** Tiempo que una fila queda resaltada después de agregarla o modificarla. */
const HIGHLIGHT_MS = 1500;
/** Espacio que se deja bajo la tabla al ajustarla al alto de la ventana. */
const TABLE_BOTTOM_GAP_PX = 16;
/** Alto mínimo de la tabla en pantallas muy bajas. */
const TABLE_MIN_HEIGHT_PX = 240;

/** Desplaza la lista hasta un producto. Existen la fila de escritorio y la tarjeta móvil; solo una es visible. */
const scrollToDetail = (saleDetailId: bigint) => {
    const target = Array.from(document.querySelectorAll<HTMLElement>(`[data-sale-detail-id="${saleDetailId.toString()}"]`))
        .find(el => el.offsetParent !== null);
    target?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
};

interface Props {
    cashSession: ICashSession | null;
}
export const useSaleProductList = ({ cashSession}:Props) => {
    const router = useRouter();
    const { sale } = useSaleStore();
    const { openSaleModal, saleModals, setFloatMessageState } = useSaleUIStore();
    const { setDetailSelected, setItemMatchDetail, lastTouchedDetail } = useSaleProcessStore();
    const { handleCheckerOpenModalCancelSale } = useCancelSale();
    const tableContainerRef = useRef<HTMLDivElement>(null);
    // `touchedAt` del último resalte que ya terminó; mientras no coincida, la fila sigue resaltada.
    const [expiredTouchAt, setExpiredTouchAt] = useState<number | null>(null);
    const highlightedDetailId = lastTouchedDetail && lastTouchedDetail.touchedAt !== expiredTouchAt
        ? lastTouchedDetail.saleDetailId
        : null;

    const viewCashSession = () => {
        if (cashSession) {
            router.push(`/cash/session/${cashSession.cashSessionId.toString()}`)
        } else {
            router.push(`/cash`)
        }
    }

    // Estable entre renders para que las filas (React.memo) no se vuelvan a renderizar sin necesidad.
    const handleOpenDetail = useCallback((detail: ISaleDetail) => {
        setItemMatchDetail(null);
        setDetailSelected(detail);
        openSaleModal('saleDetailModal');
    }, [setItemMatchDetail, setDetailSelected, openSaleModal]);

    // La tabla de escritorio ocupa el alto que queda en la ventana y hace scroll por dentro, para que el
    // buscador y los botones F4/F5/F6 sigan a la vista con muchos productos.
    useEffect(() => {
        const fitTableToViewport = () => {
            const container = tableContainerRef.current;
            if (!container) return;
            const top = container.getBoundingClientRect().top + window.scrollY;
            const maxHeight = Math.max(TABLE_MIN_HEIGHT_PX, window.innerHeight - top - TABLE_BOTTOM_GAP_PX);
            container.style.maxHeight = `${maxHeight}px`;
        };
        fitTableToViewport();
        window.addEventListener('resize', fitTableToViewport);
        return () => window.removeEventListener('resize', fitTableToViewport);
    }, []);

    // Lleva a la vista el producto recién agregado o modificado y lo resalta un momento.
    useEffect(() => {
        if (!lastTouchedDetail) return;
        scrollToDetail(lastTouchedDetail.saleDetailId);
        const timeout = setTimeout(() => setExpiredTouchAt(lastTouchedDetail.touchedAt), HIGHLIGHT_MS);
        return () => clearTimeout(timeout);
    }, [lastTouchedDetail]);

    // Producto que abriría F8; la fila lo indica en el título de su botón ⋮.
    const lastAddedDetailId = findLastAddedDetail(sale?.saleDetails, lastTouchedDetail?.saleDetailId)?.saleDetailId ?? null;

    /** F8: abre el modal del último producto agregado, sin tocar el ratón. */
    const openLastAddedDetail = () => {
        // Con otro modal abierto (pago, catálogo, el propio detalle) el atajo no hace nada.
        if (saleModals !== 'none') return;
        const detail = findLastAddedDetail(sale?.saleDetails, lastTouchedDetail?.saleDetailId);
        if (!detail) {
            setFloatMessageState({
                type: 'yellow',
                summary: 'Sin productos',
                description: 'No hay productos en la venta.',
                isActive: true,
            });
            setTimeout(() => setFloatMessageState({}), 2000);
            return;
        }
        scrollToDetail(detail.saleDetailId);
        handleOpenDetail(detail);
    };

    useKeyDown({
        F4: () => openSaleModal('inventoryListModal'),
        F5: () => viewCashSession(),
        F6: () => handleCheckerOpenModalCancelSale(),
        F8: () => openLastAddedDetail(),
    })

    return {
        sale,
        openSaleModal,
        handleCheckerOpenModalCancelSale,
        viewCashSession,
        handleOpenDetail,
        highlightedDetailId,
        lastAddedDetailId,
        tableContainerRef,
    }
}
