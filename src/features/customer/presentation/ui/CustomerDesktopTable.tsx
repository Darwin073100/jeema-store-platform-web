'use client';
import { Button } from '@/shared/ui/components/buttons'
import React from 'react'
import { AiFillProfile } from 'react-icons/ai'
import { useRouter } from 'next/navigation';
import { useCustomerStore } from '../../infraestructure/stores/customer.store';
import { PCol, PrimaryTable, PRow, PTableEmpty } from '@/shared/ui/components/tables/PrimaryTable';

const CustomerDesktopTable = () => {
    const { customersFilter } = useCustomerStore();
    const router = useRouter();
    const headTable = ['Folio', 'Nombre', 'Téfono', 'Correo', 'Ciudad']
    return (
        <PrimaryTable theadList={headTable}>
            {customersFilter.map(item => (
                <PRow>
                    <PCol>{item.customerId}</PCol>
                    <PCol>{`${item.firstName} ${item.lastName ?? ''}`}</PCol>
                    <PCol>{item.phoneNumber}</PCol>
                    <PCol>{item.email}</PCol>
                    <PCol>{item.address?.city ?? 'N/A'}</PCol>
                    <PCol className="text-right flex justify-end">
                        <Button onClick={()=> router.push(`customers/${item.customerId}`)} color='yellow' size='sm' title='Da click para ver el perfil del cliente.'>
                            <AiFillProfile size={14} /><span>Perfil</span>
                        </Button>
                    </PCol>
                    {(!customersFilter || customersFilter.length === 0) && (
                        <PTableEmpty colsNumber={headTable.length + 1} />
                    )}
                </PRow>
            ))}
        </PrimaryTable>
    )
}

export default CustomerDesktopTable
