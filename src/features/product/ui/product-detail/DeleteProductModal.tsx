import React from 'react'
import { Button } from '@/ui/components/buttons';
import { Spinner } from '@/ui/components/loadings/Spinner';
import { Modal } from '@/ui/components/modals';
import { FloatMessage } from '@/ui/components/messages';
import { IoClose } from 'react-icons/io5';
import { HiTrash } from 'react-icons/hi';
import { useDeleteProductModal } from '../../hooks/useDeleteProductModal';

const DeleteProductModal = () => {
    const {
        handleFalseDeleteOpenModal, 
        deleteOpenModal,
        onSubmit,
        floatMessageState,
        isLoading,
        product
    } = useDeleteProductModal();

    return (
        <>
            <Modal isOpen={deleteOpenModal} onClose={handleFalseDeleteOpenModal}>
                <div className='w-96 max-w-2xl max-h-[90dvh] mx-4 text-white bg-red-300 rounded-xl shadow-xl border-red-600 overflow-hidden flex flex-col'>
                    {/* Header fijo */}
                    <div className="flex flex-col p-6 pb-3 bg-red-300">
                        <h2 className="text-lg font-semibold text-white">
                            ¿Estas seguro de eliminar el producto?
                        </h2>
                        <span className='text-red-950 py-3 text-lg'>{product?.name}</span>
                    </div>
                    <div className="flex-1 overflow-y-auto">
                            {/* Botones del formulario */}
                            <div className="pb-6 flex justify-center gap-3 flex-wrap">
                                <Button
                                onClick={()=> onSubmit()}
                                    color='red'
                                    type="button"
                                    className='flex justify-center items-center min-w-[120px]'
                                    disabled={isLoading}
                                >
                                    {isLoading ? <Spinner /> : (
                                        <>
                                            <HiTrash />
                                            Eliminar
                                        </>
                                    )}
                                </Button>
                                <Button
                                    type="button"
                                    color="gray"
                                    className="flex items-center"
                                    onClick={handleFalseDeleteOpenModal}
                                    disabled={isLoading}
                                >
                                    <IoClose className="mr-2" />
                                    Cerrar
                                </Button>
                            </div>
                    </div>
                </div>
            </Modal>
            
            {/* Float Message para notificaciones */}
            {floatMessageState.isActive && (
                <FloatMessage
                    key={floatMessageState.summary || 'message'}
                    description={floatMessageState.description || ''}
                    summary={floatMessageState.summary || ''}
                    type={floatMessageState.type || 'blue'}
                    isActive={floatMessageState.isActive || false} 
                />
            )}
        </>
    )
}

export { DeleteProductModal };
