'use client'
import React, { useEffect } from 'react'
import { useEmployeeUIStore } from '../../stores/employee-ui.store';
import { useEmployeeStore } from '../../stores/employee-store';
import { Button } from '@/shared/ui/components/buttons';
import { MdOutlineAddHomeWork } from 'react-icons/md';
import { TbHomeEdit } from 'react-icons/tb';
import { EmployeeAddAddressModal } from './EmployeeAddAddressModal';
interface Props {
}
const EmployeeAddressCard = ({ }: Props) => {
    const { openEmployeeModal } = useEmployeeUIStore();
    const { employee } = useEmployeeStore()
    return (
        <aside className="lg:col-span-1 space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-lg border-t-4 border-blue-500 text-center">
                <div className='flex gap-4'>
                    <h2 className="text-2xl font-bold text-gray-900">Dirección</h2>
                    {
                        employee?.address
                            ? <Button size='sm' color='yellow'><MdOutlineAddHomeWork /> Editar</Button>
                            : <Button size='sm' color='blue' onClick={()=> openEmployeeModal('addAddress')}><TbHomeEdit /> Agregar</Button>
                    }
                </div>
                {/* Ficha de Detalles */}
                {employee?.address? <dl className="text-sm text-left pt-2 space-y-3">
                    <div className="py-1 bg-gray-100 flex justify-between p-2 rounded-lg">
                        <span className="font-semibold text-gray-600">País:</span>
                        <span className="text-blue-600 hover:underline break-all">{employee?.address?.country ?? 'N/A'}</span>
                    </div>
                    <div className="py-1 bg-gray-100 flex justify-between p-2 rounded-lg">
                        <span className="font-semibold text-gray-600">Estado:</span>
                        <span className="text-gray-800">{employee?.address?.state ?? 'N/A'}</span>
                    </div>
                    <div className="py-1 bg-gray-100 flex justify-between p-2 rounded-lg">
                        <span className="font-semibold text-gray-600">Ciudad:</span>
                        <span className="text-gray-800">{employee?.address?.city ?? 'N/A'}</span>
                    </div>
                    <div className="py-1 bg-gray-100 flex justify-between p-2 rounded-lg">
                        <span className="font-semibold text-gray-600">Municipio:</span>
                        <span className="text-gray-800 capitalize">{employee?.address?.municipality ?? 'N/A'}</span>
                    </div>
                    <div className="py-1 bg-gray-100 flex justify-between p-2 rounded-lg">
                        <span className="font-semibold text-gray-600">Código postal:</span>
                        <span className="text-gray-800 capitalize">{employee?.address?.postalCode ?? 'N/A'}</span>
                    </div>
                    <div className="py-1 bg-gray-100 flex justify-between p-2 rounded-lg">
                        <span className="font-semibold text-gray-600">Número interior:</span>
                        <span className="text-gray-800 capitalize">{employee?.address?.internalNumber ?? 'N/A'}</span>
                    </div>
                    <div className="py-1 bg-gray-100 flex justify-between p-2 rounded-lg">
                        <span className="font-semibold text-gray-600">Número exterior:</span>
                        <span className="text-gray-800 capitalize">{employee?.address?.externalNumber ?? 'N/A'}</span>
                    </div>
                    <div className="py-1 bg-gray-100 flex justify-between p-2 rounded-lg">
                        <span className="font-semibold text-gray-600">Calle:</span>
                        <span className="text-gray-800 capitalize">{employee?.address?.street ?? 'N/A'}</span>
                    </div>
                    <div className="py-1 bg-gray-100 flex justify-between p-2 rounded-lg">
                        <span className="font-semibold text-gray-600">Referencia:</span>
                        <span className="text-gray-800 capitalize">{employee?.address?.reference ?? 'N/A'}</span>
                    </div>
                </dl>:
                <div className='mt-4 text-gray-700 italic'>
                    No se encontró una dirección
                </div> }
            </div>
            <EmployeeAddAddressModal />

            {/* <EmployeeUpdateModal
                employeeRoles={employeeRoles} 
                employee={data}/> */}
        </aside>
    )
}

export {EmployeeAddressCard};
