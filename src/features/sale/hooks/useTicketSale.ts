import { useEffect, useState } from "react";
import { useSaleUIStore } from "../infraestructure/stores/sale.ui.store";
interface Props {
    saleId: bigint,
}
const useTicketSale = ({saleId}:Props) => {
    const [pdfUrl, setPdfUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    
    const { viewTicket, saleModals } = useSaleUIStore();

    const handlePrint = async () => {
        setLoading(true);
        try {
            const result = await fetch(`http://localhost:3001/api/v1/reports/tickets/sales/${saleId.toString()}`);
            if (!result.ok ) {
                return;
            }
            const blobUrl = URL.createObjectURL(await result.blob());
            setPdfUrl(blobUrl);
        } catch (error) {
            console.error("Error al cargar el PDF:", error);
            setError("No se pudo cargar el documento.");
        } finally {
            setLoading(false);
        }
    };
    
    useEffect(() => {
        if(saleModals!== 'saleTicketReprintModal'){
            handlePrint();
        }
    }, [saleId, pdfUrl]);

    useEffect(() => {
        if(saleModals==='saleTicketReprintModal'){
            handlePrint();
        }
    }, [saleId, saleModals==='saleTicketReprintModal']);
    return {
        pdfUrl,
        loading,
        error
    }
}

export default useTicketSale
