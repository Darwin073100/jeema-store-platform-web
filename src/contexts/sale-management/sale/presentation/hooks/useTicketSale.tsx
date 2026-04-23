import { useEffect, useState } from "react";
import { findTicketBySaleIdAction } from "../actions/find-ticket-by-sale-id.action";
import { useSaleUIStore } from "../stores/sale.ui.store";
import { pdf } from "@react-pdf/renderer";
import { Ticket58Document } from "../documents/Ticket58Document";
interface Props {
    saleId: bigint,
}
const useTicketSale = ({ saleId }: Props) => {
    const [pdfUrl, setPdfUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const { saleModals } = useSaleUIStore();

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

            // Crear nueva URL
            setPdfUrl(URL.createObjectURL(blob));
        } catch (error) {
            setError("No se pudo cargar el documento.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        handlePrint();
    }, [saleId, saleModals === 'saleTicketModal', pdfUrl!==null]);

    return {
        pdfUrl,
        loading,
        error
    }
}

export default useTicketSale
