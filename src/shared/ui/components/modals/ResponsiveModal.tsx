'use client'
import React, { JSX } from 'react'

interface Props {
    isOpen: boolean,
    onClose: () => void,
    children?: JSX.Element | string | JSX.Element[],
    maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '4xl' | '6xl',
    maxHeight?: 'screen' | '90vh' | '80vh' | '70vh'
}

export const ResponsiveModal = (props: Props) => {
  if (!props.isOpen) return null;

  const getMaxWidth = () => {
    switch (props.maxWidth) {
      case 'sm': return 'max-w-sm';
      case 'md': return 'max-w-md';
      case 'lg': return 'max-w-lg';
      case 'xl': return 'max-w-xl';
      case '2xl': return 'max-w-2xl';
      case '4xl': return 'max-w-4xl';
      case '6xl': return 'max-w-6xl';
      default: return 'max-w-2xl';
    }
  };

  const getMaxHeight = () => {
    switch (props.maxHeight) {
      case 'screen': return 'max-h-screen';
      case '90vh': return 'max-h-[90vh]';
      case '80vh': return 'max-h-[80vh]';
      case '70vh': return 'max-h-[70vh]';
      default: return 'max-h-[90vh]';
    }
  };

  return (
    <div
      className="bg-black bg-opacity-50 fixed inset-0 z-50 flex items-start justify-center overflow-y-auto p-4"
      onClick={props.onClose}
    >
      <div 
        onClick={e => e.stopPropagation()}
        className={`w-full ${getMaxWidth()} ${getMaxHeight()} my-4 md:my-8`}
      >
        {props.children}
      </div>
    </div>
  )
}
