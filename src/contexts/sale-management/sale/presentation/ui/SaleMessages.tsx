'use client';
import React from 'react'
import { useSaleUIStore } from '../stores/sale.ui.store'
import { FloatMessage } from '@/shared/ui/components/messages'

const SaleMessages = () => {
  const { floatMessageState } = useSaleUIStore()

  return (
    <>
        <FloatMessage
            key='sale-float-message'
            {...floatMessageState}
        />
    </>
  )
}

export { SaleMessages }
