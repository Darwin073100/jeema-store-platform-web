import React from 'react'
import { Modal } from './Modal'
import { RoundedButton } from '../buttons/RoundedButton'
import { IoClose } from 'react-icons/io5'
import clsx from 'clsx'

interface Props {
    size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full'
    title?: string
    children?: any,
    onClose: ()=> void,
    isOpen: boolean,
    className?: string,
}

const TemplateModal = ({ children, isOpen, onClose, title='Ventana', size='full', className}: Props) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} >
          <div className={clsx(`w-${size} max-w-5xl max-h-[90dvh] mx-4 text-gray-700 bg-white rounded-lg shadow-xl overflow-hidden flex flex-col`,
            className
          )}>
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
