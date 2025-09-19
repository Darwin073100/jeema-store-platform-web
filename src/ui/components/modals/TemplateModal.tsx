import React from 'react'
import { Modal } from './Modal'
import { RoundedButton } from '../buttons/RoundedButton'
import { IoClose } from 'react-icons/io5'

interface Props {
    title?: string
    children?: any,
    onClose: ()=> void,
    isOpen: boolean,
}

const TemplateModal = ({ children, isOpen, onClose, title='Ventana'}: Props) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} >
          <div className='w-full max-w-2xl max-h-[90dvh] mx-4 text-gray-700 bg-white rounded-lg shadow-xl overflow-hidden flex flex-col'>
            {/* Header fijo */}
            <div className="flex justify-between items-center px-6 py-3 border-b border-gray-200 bg-white">
              <h2 className="text-2xl text-gray-900">
                {title}
              </h2>
              <RoundedButton color='red' onClick={onClose}>
                <IoClose />
              </RoundedButton>
            </div>
    
            {/* Contenido con scroll */}
            <div className="flex-1 overflow-y-auto">
              { children }
            </div>
          </div>
        </Modal>
  )
}

export { TemplateModal }
