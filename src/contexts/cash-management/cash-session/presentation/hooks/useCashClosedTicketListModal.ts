import { useEffect, useState } from "react";
import { useCashUIStore } from "../stores/cash-ui.store";
import { findTicketCashSessionListAction } from "../actions/find-ticket-cash-session-list.action";
import { useCashStore } from "../stores/cash.store";

const useCashClosedTicketListModal = () => {
    const [pdfUrl, setPdfUrl] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    
    const { cashModal, runLoading, stopLoading } = useCashUIStore();
    const { dateInit, dateFinish } = useCashStore();

    const handlePrint = async () => {
        runLoading('cashClosedTicketList')
        try {
            const result = await findTicketCashSessionListAction(dateInit, dateFinish);
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
        if(cashModal==='cashClosedTicketList'){
            handlePrint();
        }
    }, [ cashModal==='cashClosedTicketList', dateInit, dateFinish]);

    return {
        pdfUrl,
        error
    }
}

export { useCashClosedTicketListModal };