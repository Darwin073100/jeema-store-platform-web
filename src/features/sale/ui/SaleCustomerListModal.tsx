'use client'
import React from 'react'
import clsx from 'clsx';
import { Button } from '@/shared/ui/components/buttons';
import { IoClose } from 'react-icons/io5';
import { TemplateModal } from '@/shared/ui/components/modals/TemplateModal';
import { TextInput } from '@/shared/ui/components/inputs';
import { FcIdea } from 'react-icons/fc';
import { useCustomerSale } from '../hooks/useCustomerSale';

const SaleCustomerListModal = () => {
  const { saleModals, filterCustomers, closeSaleModal, customerSelected, handleCustomerSelected,
    customerIValue, setCustomerIValue,
   } = useCustomerSale();
  return (
    <TemplateModal size='full' isOpen={saleModals==='customerListModal'} onClose={closeSaleModal} title='Relación de clientes'>
      <div className="p-6 space-y-4">
        <div className="flex flex-col justify-center items-center gap-4">
          <div className='flex flex-col gap-2'>
            <span className='flex gap-2 items-center'>
              <FcIdea className='w-9 h-9'/> 
              <span>Para elegir a un cliente, solo da click al cliente identificado en la tabla.</span>
            </span>
            <TextInput
              value={customerIValue}
              onChange={(e)=> setCustomerIValue(e.target.value)}
              autoFocus={true}
              placeholder='Busca por nombre o apellidos de un cliente'/>
          </div>
          <div className='w-full overflow-auto'>
            <table className="w-full text-left rtl:text-right">
              <thead>
                <tr className="bg-gradient-to-r from-blue-300 to-blue-400 text-white uppercase text-sm">
                  <th scope="col" className="px-6 py-4 font-semibold">
                    Folio
                  </th>
                  <th scope="col" className="px-6 py-4 font-semibold">
                    Nombre
                  </th>
                  <th scope="col" className="px-6 py-4 font-semibold">
                    Categoría
                  </th>
                  <th scope="col" className="px-6 py-4 font-semibold">
                    Ciudad
                  </th>
                </tr>
              </thead>
              <tbody>
                { filterCustomers.map(item => (<>
                  <tr key={item.customerId ?? new Date().getTime()} 
                    onClick={()=> handleCustomerSelected(item)} 
                    className={clsx(`text-sm ${customerSelected?.customerId === item.customerId? 'bg-blue-200': 'bg-white'} border-b dark:border-gray-700 border-gray-200 text-black cursor-pointer transition-all duration-300 hover:bg-blue-200`)}>
                    <td className="px-5 py-1">
                      {item.customerId}
                    </td>
                    <th scope="row" className="px-5 py-1 whitespace-nowrap font-semibold">
                      {`${item.firstName} ${item.lastName}`}
                    </th>
                    <td className="px-5 py-1">
                      {item.customerType}
                    </td>
                    <td className="px-5 py-1">
                      {item.address?.city}
                    </td>
                  </tr>
                </>))}
              </tbody>
            </table>
          </div>
        </div>
        {/* Botones del formulario */}
        <div className="flex justify-end gap-3 flex-wrap pt-4">
          <Button
            onClick={()=> closeSaleModal()}
            type="button"
            color="gray"
            className="flex items-center"
          >
            <IoClose className="mr-2 w-4 h-4" />
            Cerrar ventana
          </Button>
        </div>
      </div>
    </TemplateModal>
  )
}

export { SaleCustomerListModal }
