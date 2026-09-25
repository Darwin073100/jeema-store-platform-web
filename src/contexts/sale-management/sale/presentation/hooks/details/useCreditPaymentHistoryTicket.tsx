'use client'
import { useRef, useState } from "react";
import { pdf } from "@react-pdf/renderer";
import { CreditPaymentHistoryTicket58Document } from "../../documents/CreditPaymentHistoryTicket58Document";
import { usePrintTicket } from "@/contexts/configuration-management/printer-configuration/presentation/hooks/usePrintTicket";
import { findCashSessionByEmployeeIdAction } from "@/contexts/cash-management/cash-session/presentation/actions/find-cash-session-by-employee-id.action";
import { findTicketBySaleIdAction } from "../../actions/find-ticket-by-sale-id.action";

interface Props {
    saleId: bigint;
}

/**
 * A diferencia de un uso ingenuo del `sale` que ya tiene la página de detalle en memoria, este hook
 * SÍ hace su propio fetch (findTicketBySaleIdAction, la misma acción que usa useReprintTicketSale.tsx)
 * porque la página de detalle carga la venta con `findFinishSaleById`, que no incluye `branchOffice`
 * (ni `establishment` ni `address`) — el ticket quedaba sin esos datos. `findTicketBySaleIdAction` sí
 * carga branchOffice.address y branchOffice.establishment.details.
 *
 * El comprobante se imprime en la caja activa de quien lo solicita (sesión de caja del empleado
 * actual, misma fuente que CreditPaymentModal), no en la caja donde se originó la venta — el
 * historial de pagos se puede consultar/imprimir desde cualquier caja abierta.
 */
const useCreditPaymentHistoryTicket = ({ saleId }: Props) => {
    const [pdfUrl, setPdfUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const blobRef = useRef<Blob | null>(null);
    const cashRegisterIdRef = useRef<bigint | null>(null);

    const { printing, printError, printTicket: printTicketBlob } = usePrintTicket();

    const generatePreview = async () => {
        setError(null);
        setLoading(true);
        try {
            const cashSessionResult = await findCashSessionByEmployeeIdAction();
            const cashRegisterId = cashSessionResult.ok && cashSessionResult.value
                ? cashSessionResult.value.cashRegisterId
                : null;

            if (!cashRegisterId) {
                setError('Necesitas aperturar caja para continuar.');
                return;
            }
            cashRegisterIdRef.current = cashRegisterId;

            const ticketResult = await findTicketBySaleIdAction(saleId);
            if (!ticketResult.ok || !ticketResult.value) {
                setError('No se pudo cargar la información de la venta.');
                return;
            }

            const doc = (
                <CreditPaymentHistoryTicket58Document
                    sale={ticketResult.value}
                />
            );
            const blob = await pdf(doc).toBlob();
            blobRef.current = blob;

            setPdfUrl(URL.createObjectURL(blob));
        } catch (error) {
            console.error(error);
            setError(error instanceof Error ? error.message : 'No se pudo generar el historial de pagos.');
        } finally {
            setLoading(false);
        }
    };

    const printTicket = async () => {
        if (!blobRef.current || !cashRegisterIdRef.current) {
            return;
        }
        await printTicketBlob(blobRef.current, cashRegisterIdRef.current);
    };

    return {
        pdfUrl,
        generatePreview,
        printTicket,
        loading,
        error,
        printing,
        printError,
    };
}

export default useCreditPaymentHistoryTicket;
