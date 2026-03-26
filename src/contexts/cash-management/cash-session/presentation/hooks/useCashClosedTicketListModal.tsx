'use client'
import { useEffect, useState } from "react";
import { useCashUIStore } from "../stores/cash-ui.store";
import { useCashStore } from "../stores/cash.store";
import { ICashSession } from "../interfaces/ICashSession";
import { TicketCloseCashSessionList58Document } from "../documents/TicketCloseCashSessionList58Document";
import { pdf } from "@react-pdf/renderer";
import { useWorkspace } from "@/shared/presentation/hooks/auth/useAuth";
import { IBranchOffice } from "@/contexts/establishment-management/branch-office/presentation/interfaces/IBranchOffice";
interface Props {
    cashSessions: ICashSession[]
}
const useCashClosedTicketListModal = ({ cashSessions }: Props) => {
    const [pdfUrl, setPdfUrl] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const { branchOffice } = useWorkspace();

    const { cashModal, runLoading, stopLoading } = useCashUIStore();
    const { dateInit, dateFinish } = useCashStore();

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

            // Crear nueva URL
            setPdfUrl(URL.createObjectURL(blob));
        } catch (error) {
            setError("No se pudo cargar el documento.");
        } finally {
            stopLoading();
        }
    };

    useEffect(() => {
        if (cashModal === 'cashClosedTicketList') {
            handlePrint();
        }
    }, [cashModal === 'cashClosedTicketList', dateInit, dateFinish]);

    return {
        pdfUrl,
        error
    }
}

export { useCashClosedTicketListModal };