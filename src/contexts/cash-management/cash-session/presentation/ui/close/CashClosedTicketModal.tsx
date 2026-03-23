import React from 'react'
import { Spinner } from '@/shared/ui/components/loadings/Spinner';
import { TemplateModal } from '@/shared/ui/components/modals/TemplateModal';
import { Button } from '@/shared/ui/components/buttons';
import { IoClose } from 'react-icons/io5';
import { useCashClosedTicketModal } from '../../hooks/useCashClosedTicketModal';
import { useCashUIStore } from '@/contexts/cash-management/cash-session/presentation/stores/cash-ui.store';
interface Props {
    cashSessionId: bigint,
}
const CashClosedTicketModal = ({ cashSessionId }: Props) => {
    const { cashModal, closeCashModal } = useCashUIStore();
    const { error, pdfUrl } = useCashClosedTicketModal({ cashSessionId });

    if (!pdfUrl) {
        return;
    }
    return (
        <TemplateModal isOpen={cashModal === 'cashClosedTicket'} size='2xl' onClose={closeCashModal} title='Vista previa del ticket'>
            <div className='h-[500px]'>
                {
                    error && <div style={{ color: 'red' }}>{error}</div>
                }
                {
                    !pdfUrl &&  <div className='flex gap-2'><Spinner className='text-black' /> Esperando datos...</div>
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
                    onClick={closeCashModal}
                >
                    <IoClose className="mr-2 w-4 h-4" />
                    Cerrar
                </Button>
            </div>
        </TemplateModal>
    )
}

export { CashClosedTicketModal };