import React from 'react'
import { Spinner } from '@/shared/ui/components/loadings/Spinner';
import { TemplateModal } from '@/shared/ui/components/modals/TemplateModal';
import { Button } from '@/shared/ui/components/buttons';
import { IoClose, IoPrint } from 'react-icons/io5';
import { useTransactionUIStore } from '@/contexts/transaction-management/transaction/presentation/stores/transaction-ui.store';
import { useTransactionMovementsReportTicket } from '../hooks/useTransactionMovementsReportTicket';

const TransactionMovementsReportModal = () => {
    const { transactionModal, closeTransactionModal } = useTransactionUIStore();
    const { error, pdfUrl, printTicket, printing, printError } = useTransactionMovementsReportTicket();

    if (!pdfUrl) {
        return;
    }
    return (
        <TemplateModal isOpen={transactionModal === 'transactionMovementsReportTicket'} size='2xl' onClose={closeTransactionModal} title='Vista previa del reporte'>
            <div className='h-[500px]'>
                {
                    error && <div style={{ color: 'red' }}>{error}</div>
                }
                {
                    printError && <div style={{ color: 'red' }}>{printError}</div>
                }
                {
                    !pdfUrl && <div className='flex gap-2'><Spinner className='text-black' /> Esperando datos...</div>
                }
                <iframe
                    src={pdfUrl}
                    title="Documento PDF incrustado"
                    width="100%"
                    height="500px"
                    style={{ border: '1px solid #ccc' }}
                >
                    <p>Tu navegador no soporta iframes.</p>
                </iframe>
            </div>
            <div className="flex justify-end gap-3 flex-wrap p-4">
                <Button
                    type="button"
                    color="gray"
                    className="flex items-center"
                    onClick={closeTransactionModal}
                >
                    <IoClose className="mr-2 w-4 h-4" />
                    Cerrar
                </Button>
                <Button
                    type="button"
                    color="blue"
                    className="flex items-center"
                    disabled={!pdfUrl || printing}
                    onClick={printTicket}
                >
                    <IoPrint className="mr-2 w-4 h-4" />
                    {printing ? 'Imprimiendo...' : 'Imprimir'}
                </Button>
            </div>
        </TemplateModal>
    )
}

export { TransactionMovementsReportModal };
