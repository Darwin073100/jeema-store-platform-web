import { useEffect, useState } from "react";
import { useCashUIStore } from "../../infraestructure/stores/cash-ui.store";
import { findTicketCashSessionAction } from "../../actions/find-ticket-cash-session.action";

interface Props {
    cashSessionId: bigint,
}
const useCashClosedTicketModal = ({cashSessionId}:Props) => {
    const [pdfUrl, setPdfUrl] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    
    const { cashModal, runLoading, stopLoading } = useCashUIStore();

    const handlePrint = async () => {
        runLoading('cashClosedTicket')
        try {
            if(cashSessionId===BigInt(0)){
                return;
            }
            const result = await findTicketCashSessionAction(cashSessionId);
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
            stopLoading();
        }
    };
    
    useEffect(() => {
        if(cashModal==='cashClosedTicket'){
            handlePrint();
        }
    }, [cashSessionId, cashModal==='cashClosedTicket']);

    return {
        pdfUrl,
        error
    }
}

export { useCashClosedTicketModal };