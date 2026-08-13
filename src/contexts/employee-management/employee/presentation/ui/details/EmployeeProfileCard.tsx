'use client'
import { Badge } from '@/shared/ui/components/badges/Badge';
import React, { useEffect } from 'react'
import { formatDateWithOutTime } from '@/shared/lib/utils/date-formatter';
import { Button } from '@/shared/ui/components/buttons';
import { HiPencil } from 'react-icons/hi';
import { EmployeeUpdateModal } from '../register/EmployeeUpdateModal';
import { useEmployeeUIStore } from '../../stores/employee-ui.store';
import { useEmployeeStore } from '../../stores/employee-store';
import { EmployeeAddressCard } from './EmployeeAddressCard';
import { IEmployee } from '../../interfaces/IEmployee';
import { IEmployeeRole } from '@/contexts/employee-management/employee-role/presentation/interfaces/IEmployeeRole';
import { ImageUploader } from '@/contexts/image-management/image/presentation/ui';
import { ImageOwnerType } from '@/contexts/image-management/image/domain/enums/image-owner-type.enum';
interface Props {
    data        : IEmployee,
    employeeRoles: IEmployeeRole[],
}
const EmployeeProfileCard = ({ data, employeeRoles }: Props) => {
    const { openEmployeeModal } = useEmployeeUIStore();
    const { setEmployee } = useEmployeeStore()
    useEffect(()=>{
        setEmployee(data);
    },[data]);
    return (
        <aside className="lg:col-span-1 space-y-6">

            <div className="bg-white p-6 rounded-xl shadow-lg border-t-4 border-blue-500 text-center">

                {/* Foto de Perfil. ImageUploader ya resuelve el estado real (con/sin foto)
                    consultando al servidor, por lo que no depende de `data.photoUrl`. */}
                <div className="mb-4 flex justify-center">
                    <ImageUploader
                        ownerType={ImageOwnerType.EMPLOYEE}
                        ownerId={data.employeeId}
                        maxSlots={1}
                        entityLabel="empleado"
                    />
                </div>

                <h2 className="text-2xl font-bold text-gray-900">{data.firstName} {data.lastName}</h2>
                <div className='flex justify-center items-center gap-2 mb-2'>
                    <p className="text-md font-semibold text-green-600">{ data.employeeRole?.name }</p>
                    <Button size='sm' onClick={()=> openEmployeeModal('editEmployee')}><HiPencil/> Editar</Button>
                </div>

                {/* Badge de Estatus */}
                <Badge className="mb-4">{!data.deletedAt? 'Activo': 'Inactivo'}</Badge>

                {/* Ficha de Detalles */}
                <dl className="text-sm text-left pt-2 space-y-3">
                    <div className="py-1 bg-gray-100 flex justify-between p-2 rounded-lg">
                        <span className="font-semibold text-gray-600">Email:</span>
                        <span className="text-blue-600 hover:underline break-all">{data.email}</span>
                    </div>
                    <div className="py-1 bg-gray-100 flex justify-between p-2 rounded-lg">
                        <span className="font-semibold text-gray-600">Teléfono:</span>
                        <span className="text-gray-800">{data.phoneNumber}</span>
                    </div>
                    <div className="py-1 bg-gray-100 flex justify-between p-2 rounded-lg">
                        <span className="font-semibold text-gray-600">Cumpleaños:</span>
                        <span className="text-gray-800">{formatDateWithOutTime(data.birthDate)}</span>
                    </div>
                    <div className="py-1 bg-gray-100 flex justify-between p-2 rounded-lg">
                        <span className="font-semibold text-gray-600">Género:</span>
                        <span className="text-gray-800 capitalize">{data.gender}</span>
                    </div>
                </dl>
            </div>
            <EmployeeAddressCard />
            <EmployeeUpdateModal
                employeeRoles={employeeRoles} 
                employee={data}/>
        </aside>
    )
}

export {EmployeeProfileCard};
