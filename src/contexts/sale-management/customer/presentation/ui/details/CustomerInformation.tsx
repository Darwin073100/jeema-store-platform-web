'use client'
import React, { useEffect } from 'react'
import { ICustomer } from '../../interfaces/ICustomer';
import { FcComboChart, FcLink } from 'react-icons/fc';
import { CustomerAddressCard } from './CustomerAddressCard';
import { Card } from '@/shared/ui/components/cards';
import { Button } from '@/shared/ui/components/buttons';
import { BiPencil } from 'react-icons/bi';
import { useCustomerStore } from '../../stores/customer.store';
import { useCustomerUIStore } from '../../stores/customer-ui.store';
import { CustomerUpdateModal } from './CustomerUpdateModal';
import { FloatMessage } from '@/shared/ui/components/messages';
interface Props {
    customer: ICustomer
}
const CustomerInformation = ({ customer }:Props) => {
    const { setCustomer } = useCustomerStore();
    const { openCustomerModal, floatMessageState } = useCustomerUIStore();
    useEffect(()=>{
        setCustomer(customer);
    }, [customer]);
    return (
        <aside className="lg:col-span-1 space-y-6">
            {/* 1. FICHA DE CONTACTO PRINCIPAL */}
            <Card>
                <div className='flex items-center gap-4 mb-4'>
                    <h2 className="text-xl font-bold text-gray-800 flex items-center">
                        <span className="text-blue-500 mr-2"><FcLink /></span> 
                        <span>Contacto Principal</span>
                    </h2>
                    <Button size='sm' color='yellow' onClick={()=> openCustomerModal('editCustomer')}><BiPencil/> Editar</Button>
                </div>

                <dl className="text-sm space-y-3">
                    {/* Nombre Completo */}
                    <div>
                        <dt className="font-semibold text-gray-600">Nombre Completo:</dt>
                        <dd className="text-lg font-bold text-gray-900">{customer?.firstName} {customer?.lastName}</dd>
                    </div>

                    {/* Tipo de Cliente */}
                    <div className="pt-2 border-t border-gray-100">
                        <dt className="font-semibold text-gray-600">Tipo de Cliente:</dt>
                        <dd className="text-gray-800">{customer?.customerType}</dd>
                    </div>

                    {/* Compañía/RFC */}
                    <div className="pt-2 border-t border-gray-100">
                        <dt className="font-semibold text-gray-600">Compañía / RFC:</dt>
                        <dd className="text-gray-800">{customer?.companyName} / <span className="font-medium text-orange-600">{customer?.rfc}</span></dd>
                    </div>

                    {/* Teléfono */}
                    <div className="pt-2 border-t border-gray-100">
                        <dt className="font-semibold text-gray-600">Teléfono:</dt>
                        <dd className="text-blue-600 hover:underline cursor-pointer">{customer?.phoneNumber}</dd>
                    </div>

                    {/* Email */}
                    <div className="pt-2 border-t border-gray-100">
                        <dt className="font-semibold text-gray-600">Email:</dt>
                        <dd className="text-blue-600 hover:underline cursor-pointer break-all">{customer?.email}</dd>
                    </div>
                </dl>
            </Card>
            <CustomerUpdateModal />
            {/* 2. ESTADÍSTICAS DEL CLIENTE (Placeholder) */}
            <Card>
                <h2 className="flex items-center gap-2 text-xl font-bold text-gray-800 mb-4">
                    <FcComboChart /> <span>Estadísticas</span>
                </h2>
                <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                        <p className="text-xs text-blue-700 font-semibold">Total Compras</p>
                        <p className="text-2xl font-extrabold text-blue-900">{customer?.sales?.length ?? 0}</p>
                    </div>
                    <div className="p-3 bg-orange-50 rounded-lg border border-orange-200">
                        <p className="text-xs text-orange-700 font-semibold">Monto Acumulado</p>
                        <p className="text-lg font-extrabold text-orange-900">0</p>
                    </div>
                </div>
            </Card>
            <CustomerAddressCard
                customer={customer} />
            <FloatMessage 
                {...floatMessageState} />
        </aside>
    )
}

export { CustomerInformation };
