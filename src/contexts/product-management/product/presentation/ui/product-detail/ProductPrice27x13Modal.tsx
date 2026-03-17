'use client'
import React from 'react'
import { Spinner } from '@/shared/ui/components/loadings/Spinner';
import { TemplateModal } from '@/shared/ui/components/modals/TemplateModal';
import { Button } from '@/shared/ui/components/buttons';
import { IoClose } from 'react-icons/io5';
import { useProductUIStore } from '../../stores/product-ui.store';
import { useProductPrice27x13Modal } from '../../hooks/useProductPrice27x13Modal';

interface Props {
    inventoryId: bigint,
}

const ProductPrice27x13Modal = ({ inventoryId }: Props) => {
    const { productModals, closeProductModal } = useProductUIStore();
    const { error, pdfUrl } = useProductPrice27x13Modal({ inventoryId });

    if (!pdfUrl) {
        return;
    }
    return (
        <TemplateModal isOpen={productModals === 'print-labels-prices-27x13'} onClose={closeProductModal} title='Vista previa de la etiqueta'>
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
                    onClick={closeProductModal}
                >
                    <IoClose className="mr-2 w-4 h-4" />
                    Cerrar
                </Button>
            </div>
        </TemplateModal>
    )
}

export { ProductPrice27x13Modal };