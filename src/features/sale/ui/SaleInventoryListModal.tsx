'use client'
import clsx from 'clsx';
import React from 'react'
import { Button } from '@/shared/ui/components/buttons';
import { IoClose } from 'react-icons/io5';
import { TemplateModal } from '@/shared/ui/components/modals/TemplateModal';
import { TextInput } from '@/shared/ui/components/inputs';
import { FcIdea } from 'react-icons/fc';
import { useInventoryListModal } from '../hooks/useInventoryListModal';
import { IoMdAdd } from 'react-icons/io';
import { Spinner } from '@/shared/ui/components/loadings/Spinner';

const SaleInventoryListModal = () => {
  const { handleSetItemSelected, quantityInsert, setQuantityInsert, handleAddDetail, loading, searchProductValue,
    setSearchProductValue, filterInventoryItems, itemSelected, saleModals, closeSaleModal
  } = useInventoryListModal()
  return (
    <TemplateModal size='full' isOpen={saleModals==='inventoryListModal'} onClose={closeSaleModal} title='Catalogo de productos'>
      <div className="p-6 space-y-4">
        <div className="flex flex-col justify-center items-center gap-4">
          <div className='flex flex-col gap-2'>
            <span className='flex gap-2 items-center'>
              <FcIdea className='w-9 h-9'/> 
              <span>Para agregar el producto a la venta, da click al producto que desees agregar y en el dialogo anota la cantidad y la unidad.</span>
            </span>
            <div className='flex items-center gap-2'>
              <TextInput
                value={searchProductValue}
                onChange={(e)=> setSearchProductValue(e.target.value)}
                autoFocus={true}
                placeholder='Filtrar por nombre o código de barras'/>
            </div>
          </div>
          <div className='w-full overflow-auto'>
            <table className="w-full text-left rtl:text-right">
              <thead>
                <tr className="bg-gradient-to-r from-blue-300 to-blue-400 text-white uppercase text-sm">
                  {/* <th scope="col" className="px-6 py-4 font-semibold">
                    Código
                  </th> */}
                  <th scope="col" className="px-6 py-4 font-semibold">
                    producto
                  </th>
                  <th scope="col" className="px-6 py-4 font-semibold">
                    Precio unitario
                  </th>
                  <th scope="col" className="px-6 py-4 font-semibold">
                    Precio mayoreo
                  </th>
                  <th scope="col" className="px-6 py-4 font-semibold">
                    Cantidad mayoreo
                  </th>
                  <th scope="col" className="px-6 py-4 font-semibold">
                    Stock
                  </th>
                </tr>
              </thead>
              <tbody>
                { filterInventoryItems.map(item => (<>
                  <tr key={item.inventory?.product?.sku ?? new Date().getTime()} 
                    onClick={()=> handleSetItemSelected(item)} 
                    className={clsx(`text-sm ${itemSelected?.inventoryItemId === item.inventoryItemId? 'bg-blue-200': 'bg-white'} border-b dark:border-gray-700 border-gray-200 text-black cursor-pointer transition-all duration-300 hover:bg-blue-200`)}>
                    {/* <th scope="row" className="px-5 py-1 whitespace-nowrap font-semibold">
                      {item.inventory?.internalBarCode}
                    </th> */}
                    <th scope="row" className="px-5 py-1 whitespace-nowrap font-semibold min-w-[200px]">
                      {item.inventory?.product?.name}
                    </th>
                    <td className="px-5 py-1">
                      ${item.inventory?.salePriceOne}
                    </td>
                    <td className="px-5 py-1">
                      ${item.inventory?.salePriceMany}
                    </td>
                    <td className="px-5 py-1">
                      {item.inventory?.saleQuantityMany}
                    </td>
                    <td className="px-5 py-1">
                      {item.quantityOnHan}
                    </td>
                  </tr>
                  { itemSelected?.inventoryItemId === item.inventoryItemId && <>
                    <tr className='bg-blue-100'>
                      <th className='p-1 flex items-center gap-2'>
                        <TextInput
                          min={0}
                          value={ quantityInsert }
                          onChange={(e)=>setQuantityInsert(Number(e.target.value))}
                          className='font-medium'
                          type='number'
                          placeholder='Cantidad' />
                        <Button
                          disabled={loading==='addDetailToSaleLoading'}
                          onClick={()=> handleAddDetail()} 
                          className='font-medium'>
                            { loading==='addDetailToSaleLoading'
                              ? <Spinner/>
                              :<><IoMdAdd /> Agregar</>  
                            }
                          </Button>
                      </th>
                      <th>
                      </th>
                      <th></th>
                      <th></th>
                      <th></th>
                    </tr>
                  </>}
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

export { SaleInventoryListModal }
