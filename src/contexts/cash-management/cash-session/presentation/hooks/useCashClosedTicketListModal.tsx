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
    //
    // Decisión de diseño: este listado agrupa cortes de caja de TODA la sucursal en un rango de
    // fechas (findCashMovementsByBranchOfficeIdAction no filtra por caja), así que puede incluir
    // sesiones de más de una CashRegister. El spec de impresora por caja no cubre este caso de
    // "lista mixta" en detalle — se resuelve la impresora con la caja de la PRIMERA sesión del
    // listado (mismo tratamiento que useCashClosedTicketModal: tomar el cashRegisterId de "la"
    // CashSession, aquí la más representativa del listado). Si en el futuro se necesita imprimir
    // este resumen en varias impresoras a la vez, hay que revisitar este hook. Igual que en los
    // demás casos manuales, si no hay ninguna sesión (o no trae cashRegisterId) se pasa BigInt(0)
    // a propósito para reusar el mensaje de error existente de "sin impresora configurada".
    const printTicket = async () => {
        if (!blobRef.current) {
            return;
        }
        const cashRegisterId = cashSessions[0]?.cashRegisterId ?? BigInt(0);
        await printTicketBlob(blobRef.current, cashRegisterId);
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
