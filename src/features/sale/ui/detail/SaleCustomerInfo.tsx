'use client'
import React, { useState } from 'react'
import { SaleEntity } from '../../domain/entities/sale-entity';
import { Button } from '@/shared/ui/components/buttons';
import { useRouter } from 'next/navigation';
import { IoPersonSharp } from 'react-icons/io5';
import { Spinner } from '@/shared/ui/components/loadings/Spinner';
import { FcButtingIn } from 'react-icons/fc';
interface Props {
    data: SaleEntity
}
const SaleCustomerInfo = ({data}: Props) => {
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const handleRedirect = ()=> {
        setLoading(true);
        router.push(`/customers/${data.customerId}`);
    }
    return (
        <div className="bg-white p-5 rounded-xl shadow-lg border border-gray-200">
            {/* ... (Contenido de Cliente sigue igual) ... */}
            <h2 className="flex items-center gap-2 text-xl font-bold text-gray-800 mb-4 pb-2 border-b border-blue-500/50">
                <FcButtingIn />
                <span>Datos del Cliente</span>
            </h2>
            <dl className="text-sm">
                <div className="py-2">
                    <dt className="font-semibold text-gray-600">Nombre:</dt>
                    <dd className="text-gray-800">{data?.customer?.firstName} {data?.customer?.lastName}</dd>
                </div>
                <div className="py-2 border-t border-gray-100">
                    <dt className="font-semibold text-gray-600">Empresa:</dt>
                    <dd className="text-gray-800">{data?.customer?.companyName}</dd>
                </div>
                <div className="py-2 border-t border-gray-100">
                    <dt className="font-semibold text-gray-600">Teléfono:</dt>
                    <dd className="text-blue-600 hover:underline">{data?.customer?.phoneNumber}</dd>
                </div>
            </dl>
            <Button color='purple' className='w-full' onClick={()=> handleRedirect()}>
                {loading? <Spinner/>: <IoPersonSharp />} Ver Perfil de Cliente
            </Button>
        </div>
    )
}

export { SaleCustomerInfo };
