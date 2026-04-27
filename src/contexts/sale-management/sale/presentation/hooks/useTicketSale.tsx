import { useState } from "react";
import { findTicketBySaleIdAction } from "../actions/find-ticket-by-sale-id.action";
import { useSaleUIStore } from "../stores/sale.ui.store";
import { pdf } from "@react-pdf/renderer";
import { Ticket58Document } from "../documents/Ticket58Document";
interface Props {
}
const useTicketSale = ({}: Props) => {
    const [error, setError] = useState<string | null>(null);

    const { openSaleModal, setPdfUrl, pdfUrl, initLoading, loading, finishLoading } = useSaleUIStore();

    const handlePrint = async (saleId: bigint) => {
        initLoading('saleTicket');
        openSaleModal("saleTicketModal");
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

            // Crear nueva URL
            setPdfUrl(URL.createObjectURL(blob));
        } catch (error) {
            setError("No se pudo cargar el documento.");
        } finally {
            finishLoading();
        }
    };

    return {
        pdfUrl,
        loading,
        error,
        handlePrint,
    }
}

export default useTicketSale
