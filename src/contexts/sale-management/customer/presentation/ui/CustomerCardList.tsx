'use client'
import React from 'react'
import { Button } from '@/shared/ui/components/buttons'
import { Card } from '@/shared/ui/components/cards'
import { AiFillProfile } from 'react-icons/ai'
import { useRouter } from 'next/navigation'
import { useCustomerStore } from '../stores/customer.store'

const CustomerCardList = () => {
    const router = useRouter();
    const { customersFilter } = useCustomerStore();

    if (!customersFilter || customersFilter.length === 0) {
        return (
            <div className="bg-white rounded-xl p-6 w-full text-center text-gray-500 shadow-sm">
                No hay registros...
            </div>
        );
    }

    return (
        <>
            {customersFilter.map(item => (
                <Card key={item.customerId.toString()} className="w-full">
                    <div className="flex justify-between items-start pb-2 border-b border-gray-100 mb-2">
                        <p className="text-lg font-bold text-gray-900">
                            Folio: <span className="text-blue-600">#{item.customerId}</span>
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-y-2 text-sm">
                        <div className="col-span-2">
                            <p className="text-gray-500 font-bold">Nombre:</p>
                            <p className="text-gray-700">{`${item.firstName} ${item.lastName ?? ''}`}</p>
                        </div>
                        <div>
                            <p className="text-gray-500 font-medium">Teléfono:</p>
                            <p className="text-gray-700 font-semibold">{item.phoneNumber ?? 'N/A'}</p>
                        </div>
                        <div>
                            <p className="text-gray-500 font-medium">Correo:</p>
                            <p className="text-gray-700 font-semibold break-words">{item.email ?? 'N/A'}</p>
                        </div>
                        <div className="col-span-2">
                            <p className="text-gray-500 font-medium">Ciudad:</p>
                            <p className="text-gray-700 font-semibold">{item.address?.city ?? 'N/A'}</p>
                        </div>
                    </div>

                    <Button
                        className="w-full mt-3"
                        size="sm"
                        title='Da click para ver el perfil del cliente.'
                        onClick={() => router.push(`customers/${item.customerId}`)}
                    >
                        <AiFillProfile size={14} /><span>Perfil</span>
                    </Button>
                </Card>
            ))}
        </>
    )
}

export { CustomerCardList };
