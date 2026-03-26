import { useEffect, useState } from "react";
import { useCashUIStore } from "../stores/cash-ui.store";
import { findTicketCashSessionAction } from "../actions/find-ticket-cash-session.action";
import { pdf } from "@react-pdf/renderer";
import { TicketCloseCashSession58Document } from "../documents/TicketCloseCashSession58Document";

interface Props {
    cashSessionId: bigint,
}
const useCashClosedTicketModal = ({ cashSessionId }: Props) => {
    const [pdfUrl, setPdfUrl] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const { cashModal, runLoading, stopLoading } = useCashUIStore();

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

            // Crear nueva URL
            setPdfUrl(URL.createObjectURL(blob));
        } catch (error: any) {
            setError(error?.message ?? "No se pudo cargar el documento.");
        } finally {
            stopLoading();
        }
    };

    useEffect(() => {
        if (cashModal === 'cashClosedTicket') {
            handlePrint();
        }
    }, [cashSessionId, cashModal === 'cashClosedTicket']);

    return {
        pdfUrl,
        error
    }
}

export { useCashClosedTicketModal };