'use client'
import { Badge } from '@/shared/ui/components/badges/Badge';
import { Button } from '@/shared/ui/components/buttons';
import { TextInput } from '@/shared/ui/components/inputs';
import { Spinner } from '@/shared/ui/components/loadings/Spinner';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react'
import { IoPersonAdd } from 'react-icons/io5';
import { PiMicrosoftExcelLogoFill } from "react-icons/pi";
import { useCustomerStore } from '../stores/customer.store';
import { ICustomer } from '../interfaces/ICustomer';
import { ButtonOutLine } from '@/shared/ui/components/buttons/ButtonOutLine';
interface Props {
    customersList: ICustomer[]
}
const CustomerOptios = ({ customersList }: Props) => {
    const router = useRouter();
    const [loading, setLoading] = React.useState(false);
    const { customersFilter, setCustomersFilter,  searchValue, setSearchValue } = useCustomerStore();

    const handleNewEmployee = () => {
        setLoading(true);
        router.push('/customers/new');
    }

    useEffect(()=>{
        const regex = new RegExp(searchValue, 'i');
        const newcustomerByFirstNameFilter = customersList.filter( item => regex.test(item.firstName ?? ''));
        const newcustomerByLastNameFilter = customersList.filter( item => regex.test(item.lastName ?? ''));
        const completFilter = [...(new Set([...newcustomerByFirstNameFilter, ...newcustomerByLastNameFilter]))]
        setCustomersFilter(completFilter);
    }, [searchValue]);

    useEffect(()=>{
        setCustomersFilter(customersList);
    }, [])

    return (
        <>
            <div className="flex gap-4 items-center justify-between">
                <ButtonOutLine onClick={() => handleNewEmployee()} disabled={loading}>
                    {loading ? <Spinner color='blue'/> : <IoPersonAdd />}
                    Cliente nuevo
                </ButtonOutLine>
                <div className='flex gap-4 items-center'>
                    <ButtonOutLine disabled={loading} color='green'>
                        <PiMicrosoftExcelLogoFill />
                        Exportar a Excel
                    </ButtonOutLine>
                    <div>
                        Empleados<Badge>{customersFilter.length}</Badge>
                    </div>
                </div>
            </div>
            <div className='my-2'>
                <TextInput
                    onChange={(e)=> setSearchValue(e.target.value ?? '')}
                    value={searchValue}
                    placeholder="Buscar por nombre del cliente o apellidos"/>
            </div>
        </>
    )
}

export { CustomerOptios };
