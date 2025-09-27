'use client'
import React from 'react'
import { Button } from '@/ui/components/buttons';
import { IoClose } from 'react-icons/io5';
import { TemplateModal } from '@/ui/components/modals/TemplateModal';
import { TextInput } from '@/ui/components/inputs';
import { FcIdea } from 'react-icons/fc';
import { useSaleInventoryListStore } from '../infraestructure/stores/sale.inventory-list.store';
import { useInventoryListModal } from '../hooks/useInventoryListModal';
import { IoMdAdd } from 'react-icons/io';
import clsx from 'clsx';
import { Spinner } from '@/ui/components/loadings/Spinner';
import { FloatMessage } from '@/ui/components/messages';

const SaleInventoryListModal = () => {
  const { closeModalInventoryList, modalInventoryList, filterInventoryItems, itemSelected } = useSaleInventoryListStore();
  const { handleSetItemSelected, quantityInsert, setQuantityInsert, floatMessageState, handleAddDetail, isLoading,
    searchProductValue, setSearchProductValue,
  } = useInventoryListModal()
  return (
    <TemplateModal size='full' isOpen={modalInventoryList} onClose={closeModalInventoryList} title='Catalogo de productos'>
      <div className="p-6 space-y-4">
        <div className="flex flex-col justify-center items-center gap-4">
          <div className='flex flex-col gap-2'>
            <span className='flex gap-2 items-center'>
              <FcIdea className='w-9 h-9'/> 
              <span>Para agregar el producto a la venta, da click al producto que desees agregar y en el dialogo anota la cantidad y la unidad.</span>
            </span>
            <TextInput
              value={searchProductValue}
              onChange={(e)=> setSearchProductValue(e.target.value)}
              autoFocus={true}
              placeholder='Ingresa el nombre del producto que estas buscando'/>
          </div>
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
                  <th scope="row" className="px-5 py-1 whitespace-nowrap font-semibold">
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
                    <th></th>
                    <th className='p-1'>
                      <TextInput
                        min={0}
                        value={ quantityInsert }
                        onChange={(e)=>setQuantityInsert(Number(e.target.value))}
                        className='font-medium'
                        type='number'
                        placeholder='Cantidad' />
                    </th>
                    <th>
                      <Button
                        disabled={isLoading}
                        onClick={()=> handleAddDetail()} 
                        className='font-medium'>
                          { isLoading
                            ? <Spinner/>
                            :<><IoMdAdd /> Agregar</>  
                          }
                        </Button>
                    </th>
                    <th></th>
                    <th></th>
                  </tr>
                </>}
              </>))}
            </tbody>
          </table>
        </div>
        {/* Botones del formulario */}
        <div className="flex justify-end gap-3 flex-wrap pt-4">
          <Button
            onClick={()=> closeModalInventoryList()}
            type="button"
            color="gray"
            className="flex items-center"
          >
            <IoClose className="mr-2 w-4 h-4" />
            Cerrar ventana
          </Button>
        </div>
      </div>
      <FloatMessage 
        key='message-sale-inventory-list-modal'
        {...floatMessageState} />
    </TemplateModal>
  )
}

export { SaleInventoryListModal }
