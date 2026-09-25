'use client'
import { useRef, useState } from "react";
import { pdf } from "@react-pdf/renderer";
import { CreditPaymentHistoryTicket58Document } from "../../documents/CreditPaymentHistoryTicket58Document";
import { usePrintTicket } from "@/contexts/configuration-management/printer-configuration/presentation/hooks/usePrintTicket";
import { findCashSessionByEmployeeIdAction } from "@/contexts/cash-management/cash-session/presentation/actions/find-cash-session-by-employee-id.action";
import { ISale } from "../../interfaces/ISale";

interface Props {
    sale: ISale;
}

/**
 * A diferencia de useReprintTicketSale.tsx, este hook no hace fetch propio: la página de detalle
 * de venta ya tiene la ISale completa (incluido salePayments hidratado con employee) en memoria,
 * así que solo genera el PDF de vista previa y, al confirmar, lo imprime.
 *
 * El comprobante se imprime en la caja activa de quien lo solicita (sesión de caja del empleado
 * actual, misma fuente que CreditPaymentModal), no en la caja donde se originó la venta — el
 * historial de pagos se puede consultar/imprimir desde cualquier caja abierta.
 */
const useCreditPaymentHistoryTicket = ({ sale }: Props) => {
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

            const doc = (
                <CreditPaymentHistoryTicket58Document
                    sale={sale}
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
