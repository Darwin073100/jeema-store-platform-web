import { useEffect, useState } from "react";
import { useSaleUIStore } from "../stores/sale.ui.store";
import { findTicketBySaleIdAction } from "../actions/find-ticket-by-sale-id.action";
interface Props {
    saleId: bigint,
}
const useReprintTicketSale = ({saleId}:Props) => {
    const [pdfUrl, setPdfUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    
    const { saleModals } = useSaleUIStore();

    const handlePrint = async () => {
        setLoading(true);
        try {
            if(saleId===BigInt(0)){
                return;
            }
            const result = await findTicketBySaleIdAction(saleId);
            if (!result.ok ) {
                return;
            }
            if (!result.value ) {
                return;
            }
            const blobUrl = URL.createObjectURL(await result.value);
            setPdfUrl(blobUrl);
        } catch (error) {
            setError("No se pudo cargar el documento.");
        } finally {
            setLoading(false);
        }
    };

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

export default useReprintTicketSale
