import { useState } from "react";
import { findTicketBySaleIdAction } from "../actions/find-ticket-by-sale-id.action";
import { useSaleUIStore } from "../stores/sale.ui.store";
import { pdf } from "@react-pdf/renderer";
import { Ticket58Document } from "../documents/Ticket58Document";
import { usePrintTicket } from "@/contexts/configuration-management/printer-configuration/presentation/hooks/usePrintTicket";
interface Props {
}
const useTicketSale = ({}: Props) => {
    const [error, setError] = useState<string | null>(null);

    const { openSaleModal, setPdfUrl, pdfUrl, initLoading, loading, finishLoading, setFloatMessageState } = useSaleUIStore();
    const { printTicket } = usePrintTicket();

    // Impresión silenciosa en la impresora térmica configurada para la caja registradora donde se
    // hizo la venta, disparada en paralelo tras generar el ticket — SOLO en este modal (al
    // finalizar una venta). La venta ya está persistida en backend en este punto — un fallo aquí
    // (QZ Tray apagado, impresora desconectada) nunca debe afectar el modal ni el estado de la
    // venta, solo mostrar un aviso no bloqueante. Los demás modales de ticket (reimpresión, cierre
    // de caja) NO auto-imprimen — ahí el usuario dispara la impresión con el botón "Imprimir".
    const printSilently = async (blob: Blob, cashRegisterId: bigint) => {
        try {
            await printTicket(blob, cashRegisterId, { requireAutoPrintOnSale: true });
        } catch (printError) {
            setFloatMessageState({
                summary: 'Impresión no disponible',
                description: 'No se pudo imprimir automáticamente — revisa la impresora.',
                type: 'yellow',
                isActive: true,
            });
            setTimeout(() => setFloatMessageState({}), 5000);
        }
    };

    const handlePrint = async (saleId: bigint) => {
        initLoading('saleTicket');
        openSaleModal("saleTicketModal");
        try {
            if (saleId === BigInt(0)) {
                return;
            }
            const result = await findTicketBySaleIdAction(saleId);
            if (!result.ok) {
                return;
            }
            if (!result.value) {
                return;
            }
            // Generar el Blob usando el componente de React
            const doc = (
                <Ticket58Document
                    sale={result.value}
                />
            );
            const blob = await pdf(doc).toBlob();

            // Crear nueva URL
            setPdfUrl(URL.createObjectURL(blob));

            // La caja registradora donde se hizo la venta viene de la propia venta ya cargada
            // (sale.cashSession.cashRegisterId), nunca de un store de UI — ver spec de impresora
            // por caja. Si la venta no tiene cashSession asociada (no debería ocurrir en flujo
            // normal), simplemente se omite la impresión automática, en silencio.
            const cashRegisterId = result.value.cashSession?.cashRegisterId;
            if (cashRegisterId) {
                // Disparo en paralelo, sin esperar ni bloquear el modal ya abierto.
                void printSilently(blob, cashRegisterId);
            }
        } catch (error) {
            setError("No se pudo cargar el documento.");
        } finally {
            finishLoading();
        }
    };

    return {
        pdfUrl,
        loading,
        error,
        handlePrint,
    }
}

export default useTicketSale
