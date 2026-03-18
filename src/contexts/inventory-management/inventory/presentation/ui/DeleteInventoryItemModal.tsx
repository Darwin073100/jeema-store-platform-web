import React from 'react'
import { Button } from '@/shared/ui/components/buttons';
import { RoundedButton } from '@/shared/ui/components/buttons/RoundedButton';
import { Spinner } from '@/shared/ui/components/loadings/Spinner';
import { Modal } from '@/shared/ui/components/modals';
import { FloatMessage } from '@/shared/ui/components/messages';
import { IoClose } from 'react-icons/io5';
import { useDeleteInventoryItemModal } from '../../../../../features/inventory/hooks/useDeleteInventoryItemModal';
import { HiTrash } from 'react-icons/hi';

const DeleteInventoryItemModal = () => {
    const {
        handleFalseDeleteOpenModal, 
        deleteOpenModal,
        onSubmit,
        floatMessageState,
        isLoading
    } = useDeleteInventoryItemModal();

    return (
        <>
            <Modal isOpen={deleteOpenModal} onClose={handleFalseDeleteOpenModal}>
                <div className='w-96 max-w-2xl max-h-[90dvh] mx-4 text-white bg-red-300 rounded-xl shadow-xl border-red-600 overflow-hidden flex flex-col'>
                    {/* Header fijo */}
                    <div className="flex justify-between items-center p-6 bg-red-300">
                        <h2 className="text-lg font-semibold text-white">
                            ¿Estas seguro de eliminar este stock?
                        </h2>
                    </div>
                    <div className="flex-1 overflow-y-auto">
                        <div className="p-6 space-y-4">
                            {/* Botones del formulario */}
                            <div className="flex justify-center gap-3 flex-wrap">
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

export { DeleteInventoryItemModal };
