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
    const cashRegisterIdRef = useRef<bigint | null>(null);

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
            // Caja registradora donde se hizo la venta original, tomada de la propia venta
            // (sale.cashSession.cashRegisterId) — nunca de un store de UI, ver spec de impresora
            // por caja.
            cashRegisterIdRef.current = result.value.cashSession?.cashRegisterId ?? null;

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
    // "Imprimir" del modal. Si la venta no tiene cashRegisterId resuelto, se pasa BigInt(0) a
    // propósito: usePrintTicket ya sabe tratar una caja inválida como "sin impresora configurada"
    // y muestra el mismo mensaje de error que el resto de casos manuales — no hace falta duplicar
    // ese mensaje aquí, ya que esta es una acción manual del usuario (no debe fallar en silencio).
    const printTicket = async () => {
        if (!blobRef.current) {
            return;
        }
        await printTicketBlob(blobRef.current, cashRegisterIdRef.current ?? BigInt(0));
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
