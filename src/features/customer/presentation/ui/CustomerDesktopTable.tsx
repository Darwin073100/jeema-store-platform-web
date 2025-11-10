'use client';
import { Button } from '@/ui/components/buttons'
import { BasicTable, BCol, BRow } from '@/ui/components/tables/BasicTable'
import React from 'react'
import { AiFillProfile } from 'react-icons/ai'
import { useRouter } from 'next/navigation';
import { useCustomerStore } from '../../infraestructure/stores/customer.store';

const CustomerDesktopTable = () => {
    const { customersFilter } = useCustomerStore();
    const router = useRouter();
    const headTable = ['Folio', 'Nombre', 'Téfono', 'Correo', 'Ciudad']
    return (
        <BasicTable theadList={headTable}>
            {customersFilter.map(item => (
                <BRow>
                    <BCol>{item.customerId}</BCol>
                    <BCol>{`${item.firstName} ${item.lastName ?? ''}`}</BCol>
                    <BCol>{item.phoneNumber}</BCol>
                    <BCol>{item.email}</BCol>
                    <BCol>{item.address?.city ?? 'N/A'}</BCol>
                    <BCol className="text-right flex justify-end">
                        <Button onClick={()=> router.push(`customers/${item.customerId}`)} color='yellow' size='sm' title='Da click para ver el perfil del cliente.'>
                            <AiFillProfile size={14} /><span>Perfil</span>
                        </Button>
                    </BCol>
                </BRow>
            ))}
        </BasicTable>
    )
}

export default CustomerDesktopTable
