import { useEffect, useRef, useState } from "react";
import { useSaleUIStore } from "../stores/sale.ui.store";
import { findTicketBySaleIdAction } from "../actions/find-ticket-by-sale-id.action";
import { pdf } from "@react-pdf/renderer";
import { Ticket58Document } from "../documents/Ticket58Document";
import { usePrintTicket } from "@/contexts/configuration-management/printer-configuration/presentation/hooks/usePrintTicket";
interface Props {
    saleId: bigint,
}
const useReprintTicketSale = ({ saleId }: Props) => {
    const [pdfUrl, setPdfUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const blobRef = useRef<Blob | null>(null);

    const { saleModals } = useSaleUIStore();
    const { printing, printError, printTicket: printTicketBlob } = usePrintTicket();

    const handlePrint = async () => {
        setLoading(true);
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
            blobRef.current = blob;

            // Crear nueva URL
            setPdfUrl(URL.createObjectURL(blob));
        } catch (error) {
            console.error(error)
            setError("No se pudo cargar el documento.");
        } finally {
            setLoading(false);
        }
    };

    // Este modal (reimpresión manual) NO imprime automáticamente — solo el modal de venta al
    // finalizar (useTicketSale) lo hace. Aquí el usuario dispara la impresión con el botón
    // "Imprimir" del modal.
    const printTicket = async () => {
        if (!blobRef.current) {
            return;
        }
        await printTicketBlob(blobRef.current);
    };

    useEffect(() => {
        if (saleModals === 'saleTicketReprintModal') {
            handlePrint();
        }
    }, [saleId, saleModals === 'saleTicketReprintModal']);
    return {
        pdfUrl,
        loading,
        error,
        printTicket,
        printing,
        printError,
    }
}

export default useReprintTicketSale
