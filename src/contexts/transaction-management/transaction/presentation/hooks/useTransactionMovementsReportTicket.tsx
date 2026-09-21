'use client'
import { useEffect, useRef, useState } from "react";
import { useTransactionUIStore } from "../stores/transaction-ui.store";
import { useTransactionStore } from "../stores/transaction.store";
import { TransactionMovementsReportDocument } from "../documents/TransactionMovementsReportDocument";
import { pdf } from "@react-pdf/renderer";
import { useWorkspace } from "@/shared/ui/hooks/auth/useAuth";
import { usePrintTicket } from "@/contexts/configuration-management/printer-configuration/presentation/hooks/usePrintTicket";

const useTransactionMovementsReportTicket = () => {
    const [pdfUrl, setPdfUrl] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const blobRef = useRef<Blob | null>(null);
    const { branchOffice } = useWorkspace();

    const { transactionModal } = useTransactionUIStore();
    const { transactionsFiltered, financialSummary, dateInit, dateFinish } = useTransactionStore();
    const { printing, printError, printTicket: printTicketBlob } = usePrintTicket();

    const handlePrint = async () => {
        try {
            // Generar el Blob usando el componente de React
            const doc = (
                <TransactionMovementsReportDocument
                    financialSummary={financialSummary}
                    branchOffice={branchOffice}
                    dateInit={dateInit}
                    dateFinish={dateFinish}
                />
            );
            const blob = await pdf(doc).toBlob();
            blobRef.current = blob;

            // Crear nueva URL
            setPdfUrl(URL.createObjectURL(blob));
        } catch (error) {
            setError("No se pudo cargar el documento.");
        }
    };

    // Este modal NO imprime automáticamente — el usuario dispara la impresión con el botón
    // "Imprimir" del modal, igual que en useCashClosedTicketListModal.
    //
    // Decisión de diseño: este reporte agrega montos de TODA la sucursal en un rango de fechas
    // (no es el corte de una sola caja), así que las transacciones consideradas pueden venir de
    // varias cajas registradoras a la vez, o incluso no tener ninguna (egresos/ingresos manuales
    // sin venta asociada). No existe una CashRegister "canónica" para un reporte multi-caja, así
    // que se resuelve la impresora con la caja de la PRIMERA transacción filtrada que sí tenga una
    // venta con sesión de caja asociada (transactionsFiltered.find(...).sale?.cashSession?.cashRegisterId).
    // Si ninguna transacción del rango cumple esa condición (por ejemplo, un periodo sin ventas, solo
    // egresos manuales), se pasa BigInt(0) A PROPÓSITO para reusar el mensaje de error existente de
    // "No hay una impresora configurada y activa para esta caja" que ya lanza usePrintTicket cuando
    // cashRegisterId es 0, en vez de inventar un manejo de error distinto para este caso.
    const printTicket = async () => {
        if (!blobRef.current) {
            return;
        }
        const cashRegisterId = transactionsFiltered.find(t => t.sale?.cashSession?.cashRegisterId)?.sale?.cashSession?.cashRegisterId ?? BigInt(0);
        await printTicketBlob(blobRef.current, cashRegisterId);
    };

    useEffect(() => {
        if (transactionModal === 'transactionMovementsReportTicket') {
            handlePrint();
        }
    }, [transactionModal === 'transactionMovementsReportTicket', dateInit, dateFinish, financialSummary]);

    return {
        pdfUrl,
        error,
        printTicket,
        printing,
        printError,
    }
}

export { useTransactionMovementsReportTicket };
