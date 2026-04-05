import React from 'react'
import { Spinner } from '@/shared/ui/components/loadings/Spinner';
import { TemplateModal } from '@/shared/ui/components/modals/TemplateModal';
import { useSaleUIStore } from '../stores/sale.ui.store';
import { Button } from '@/shared/ui/components/buttons';
import { IoClose } from 'react-icons/io5';
import useReprintTicketSale from '../hooks/useReprintTicketSale';
interface Props {
    saleId: bigint,
}
const SaleReprintTicketModal = ({ saleId }: Props) => {
    const { saleModals, closeSaleModal } = useSaleUIStore();
    const { error, loading, pdfUrl } = useReprintTicketSale({ saleId });

    return (
        <TemplateModal isOpen={saleModals === 'saleTicketReprintModal'} size='xl' onClose={closeSaleModal} title='Vista previa del ticket'>
            <div className='h-[500px]'>
                {
                    error && <div style={{ color: 'red' }}>{error}</div>
                }
                {
                    loading && <div className='flex gap-2 w-full h-full justify-center items-center'><Spinner color='black' size={14} /> Esperando datos...</div>
                }
                {
                    pdfUrl && <iframe
                        src={pdfUrl}
                        title="Documento PDF incrustado"
                        width="100%"
                        height="500px"
                        style={{ border: '1px solid #ccc' }}
                    >
                        <p>Tu navegador no soporta iframes.</p>
                    </iframe>
                }
            </div>
            <div className="flex justify-end gap-3 flex-wrap p-4">
                <Button
                    type="button"
                    color="gray"
                    className="flex items-center"
                    onClick={closeSaleModal}
                >
                    <IoClose className="mr-2 w-4 h-4" />
                    Cerrar
                </Button>
            </div>
        </TemplateModal>
    )
}

export { SaleReprintTicketModal };