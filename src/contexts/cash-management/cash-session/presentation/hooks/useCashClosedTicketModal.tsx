import { useEffect, useRef, useState } from "react";
import { useCashUIStore } from "../stores/cash-ui.store";
import { findTicketCashSessionAction } from "../actions/find-ticket-cash-session.action";
import { pdf } from "@react-pdf/renderer";
import { TicketCloseCashSession58Document } from "../documents/TicketCloseCashSession58Document";
import { usePrintTicket } from "@/contexts/configuration-management/printer-configuration/presentation/hooks/usePrintTicket";

interface Props {
    cashSessionId: bigint,
}
const useCashClosedTicketModal = ({ cashSessionId }: Props) => {
    const [pdfUrl, setPdfUrl] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const blobRef = useRef<Blob | null>(null);
    const cashRegisterIdRef = useRef<bigint | null>(null);

    const { cashModal, runLoading, stopLoading } = useCashUIStore();
    const { printing, printError, printTicket: printTicketBlob } = usePrintTicket();

    const handlePrint = async () => {
        runLoading('cashClosedTicket')
        try {
            if (cashSessionId === BigInt(0)) {
                return;
            }
            const result = await findTicketCashSessionAction(cashSessionId);
            if (!result.ok) {
                return;
            }
            if (!result.value) {
                return;
            }
            // Generar el Blob usando el componente de React
            const doc = (
                <TicketCloseCashSession58Document
                    cashSession={result.value}
                />
            );
            const blob = await pdf(doc).toBlob();
            blobRef.current = blob;
            // Caja registradora que se está cerrando, tomada directamente de la CashSession que
            // se está imprimiendo (no de useCashStore().cashRegisterSelected — ver spec de
            // impresora por caja, es estado efímero de UI de administración, no fuente de verdad
            // para imprimir).
            cashRegisterIdRef.current = result.value.cashRegisterId ?? null;

            // Crear nueva URL
            setPdfUrl(URL.createObjectURL(blob));
        } catch (error: any) {
            setError(error?.message ?? "No se pudo cargar el documento.");
        } finally {
            stopLoading();
        }
    };

    // Este modal NO imprime automáticamente — el usuario dispara la impresión con el botón
    // "Imprimir" del modal. Solo el modal de venta al finalizar (useTicketSale) auto-imprime. Si
    // no se pudo resolver la caja, se pasa BigInt(0) a propósito: usePrintTicket ya trata una caja
    // inválida como "sin impresora configurada" y muestra el mismo mensaje de error que el resto
    // de casos manuales.
    const printTicket = async () => {
        if (!blobRef.current) {
            return;
        }
        await printTicketBlob(blobRef.current, cashRegisterIdRef.current ?? BigInt(0));
    };

    useEffect(() => {
        if (cashModal === 'cashClosedTicket') {
            handlePrint();
        }
    }, [cashSessionId, cashModal === 'cashClosedTicket']);

    return {
        pdfUrl,
        error,
        printTicket,
        printing,
        printError,
    }
}

export { useCashClosedTicketModal };
