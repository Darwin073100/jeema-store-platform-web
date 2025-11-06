'use client'
import React, { JSX } from 'react'

interface Props {
    isOpen: boolean,
    onClose: () => void,
    children?: JSX.Element | string | JSX.Element[]
}
export const Modal = (props: Props) => {
  if (!props.isOpen) return null;

  return (
    <div
      id={new Date().getSeconds().toString()}
      className="bg-[rgba(0,0,0,0.3)] h-full fixed inset-0 z-50 flex items-start justify-center overflow-y-auto overflow-x-hidden p-4"
      onClick={()=>props.onClose()}
    >
      <div 
        onClick={e => e.stopPropagation()}
        className="w-full flex justify-center items-start min-h-full py-4"
      >
        {props.children}
      </div>
    </div>
  )
}
