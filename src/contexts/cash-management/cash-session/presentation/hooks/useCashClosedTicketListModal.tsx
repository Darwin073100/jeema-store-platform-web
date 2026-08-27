'use client'
import { useEffect, useRef, useState } from "react";
import { useCashUIStore } from "../stores/cash-ui.store";
import { useCashStore } from "../stores/cash.store";
import { ICashSession } from "../interfaces/ICashSession";
import { TicketCloseCashSessionList58Document } from "../documents/TicketCloseCashSessionList58Document";
import { pdf } from "@react-pdf/renderer";
import { useWorkspace } from "@/shared/presentation/hooks/auth/useAuth";
import { IBranchOffice } from "@/contexts/establishment-management/branch-office/presentation/interfaces/IBranchOffice";
import { usePrintTicket } from "@/contexts/configuration-management/printer-configuration/presentation/hooks/usePrintTicket";
interface Props {
    cashSessions: ICashSession[]
}
const useCashClosedTicketListModal = ({ cashSessions }: Props) => {
    const [pdfUrl, setPdfUrl] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const blobRef = useRef<Blob | null>(null);
    const { branchOffice } = useWorkspace();

    const { cashModal, runLoading, stopLoading } = useCashUIStore();
    const { dateInit, dateFinish } = useCashStore();
    const { printing, printError, printTicket: printTicketBlob } = usePrintTicket();

    const handlePrint = async () => {
        runLoading('cashClosedTicketList')
        try {
            // Generar el Blob usando el componente de React
            const doc = (
                <TicketCloseCashSessionList58Document
                    branchOffice={null}
                    cashSessions={cashSessions}
                />
            );
            const blob = await pdf(doc).toBlob();
            blobRef.current = blob;

            // Crear nueva URL
            setPdfUrl(URL.createObjectURL(blob));
        } catch (error) {
            setError("No se pudo cargar el documento.");
        } finally {
            stopLoading();
        }
    };

    // Este modal NO imprime automáticamente — el usuario dispara la impresión con el botón
    // "Imprimir" del modal. Solo el modal de venta al finalizar (useTicketSale) auto-imprime.
    const printTicket = async () => {
        if (!blobRef.current) {
            return;
        }
        await printTicketBlob(blobRef.current);
    };

    useEffect(() => {
        if (cashModal === 'cashClosedTicketList') {
            handlePrint();
        }
    }, [cashModal === 'cashClosedTicketList', dateInit, dateFinish]);

    return {
        pdfUrl,
        error,
        printTicket,
        printing,
        printError,
    }
}

export { useCashClosedTicketListModal };
