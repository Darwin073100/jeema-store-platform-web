'use client'
import React from 'react'
import { TiUserAdd } from "react-icons/ti";
import { FcKey, FcMediumPriority } from 'react-icons/fc';
import { EmployeeEntity } from '../../domain/entities/employee.entity';
import { Button } from '@/shared/ui/components/buttons';
import { MdLockReset } from 'react-icons/md';
import { TbTrashXFilled } from 'react-icons/tb';
import { ButtonOutLine } from '@/shared/ui/components/buttons/ButtonOutLine';
import { AlertMessage } from '@/shared/ui/components/messages/AlertMessage';
import { EmpRegisterUserModal } from '../register/EmpRegisterUserModal';
import { RoleEntity } from '@/features/auth/domain/entities/role.entity';
import { useEmployeeUIStore } from '../../infraestructure/stores/employee-ui.store';
import { FloatMessage } from '@/shared/ui/components/messages';
import { useStateUser } from '../../infraestructure/hooks/useDeleteUser';
import { Spinner } from '@/shared/ui/components/loadings/Spinner';
import { IoMdCheckmarkCircle } from 'react-icons/io';
import { EmpResetPasswordModal } from '../register/EmpResetPasswordModal';
import { useWorkspace } from '@/shared/hooks/useAuth';
interface Props {
    data: EmployeeEntity,
    userRoles: RoleEntity[]
}
const EmployeeUserInformation = ({ data, userRoles }:Props) => {
    const { openEmployeeModal, floatMessageState, loading } = useEmployeeUIStore();
    const { employee } = useWorkspace();
    const { handleDeleteUser } = useStateUser();
    console.log(data.employeeId);
    console.log(employee?.employeeId);
    console.log((data?.employeeId === BigInt(employee?.employeeId ?? 0)));
    console.log((data?.employeeId !== BigInt(employee?.employeeId ?? 0)));
    return (
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
            <h2 className="flex items-center gap-2 text-xl font-bold text-gray-800 mb-4 pb-3 border-b border-gray-100">
                <FcKey /> <span>Gestión de Usuario y Acceso</span>
            </h2>

            {data.user ? (
                // Opción 1: EL EMPLEADO YA TIENE USUARIO ASIGNADO
                <AlertMessage>
                    <p className="font-bold mb-1">Email de Acceso Asignado</p>
                    <div className="flex justify-between items-center text-sm">
                        <div>
                            <span className="font-semibold text-gray-700">Email:</span> <span className="font-mono text-gray-900">{data.user.email}</span>
                        </div>
                        <div className='flex gap-4'>
                            <ButtonOutLine size='sm' color='yellow' onClick={()=> openEmployeeModal('resetPassword')}>
                                <MdLockReset />
                                Restablecer Contraseña
                            </ButtonOutLine>
                            {(BigInt(data.employeeId) !== BigInt(employee?.employeeId ?? 0)) && <>
                                <ButtonOutLine size='sm' color={data.user.isActive? 'red': 'green'} 
                                    onClick={()=> handleDeleteUser(data.user?.userId ?? BigInt(0), data.user?.isActive ?? false)}>
                                    {
                                        loading==='stateUser'
                                            ? <Spinner size={14} />
                                            : data.user.isActive? <TbTrashXFilled />: <IoMdCheckmarkCircle/>
                                    }
                                    {
                                        data.user.isActive? 'Desactivar Usuario': 'Activar Usuario'
                                    }
                                </ButtonOutLine>
                            </>}
                        </div>
                    </div>
                    <EmpResetPasswordModal 
                        userId={data.user.userId}/>
                </AlertMessage>
            ) : (
                // Opción 2: DAR DE ALTA USUARIO (SOLUCIÓN AL REQUERIMIENTO)
                <AlertMessage color='orange' className='flex justify-between items-center'>
                    <p className="font-bold flex items-center gap-2">
                        <FcMediumPriority /> <span>No hay usuario de acceso asignado.</span>
                    </p>
                    <Button size='sm' onClick={()=> openEmployeeModal('registerUser')}>
                        <TiUserAdd />
                        Dar de Alta Usuario
                    </Button>
                    <EmpRegisterUserModal
                        employeeId={data.employeeId}
                        userRoles={userRoles} />
                </AlertMessage>
            )}
            <FloatMessage 
                {...floatMessageState}/>
        </div>
    )
}

export { EmployeeUserInformation };
