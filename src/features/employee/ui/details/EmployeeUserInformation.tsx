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
import { BiAddToQueue, BiPencil, BiTrash } from 'react-icons/bi';
import { EmployeeUpdateUserModal } from '../register/EmployeeUpdateUserModal';
import { EmployeeUpdateUserRoleModal } from '../register/EmployeeUpdateUserRoleModal';
import { useEmployeeUpdateUserRoleModal } from '../../infraestructure/hooks/useEmployeeUpdateUserRoleModal';
interface Props {
    data: EmployeeEntity,
    userRoles: RoleEntity[]
}
const EmployeeUserInformation = ({ data, userRoles }:Props) => {
    const { openEmployeeModal, floatMessageState, loading } = useEmployeeUIStore();
    const { handleOpenModal } = useEmployeeUpdateUserRoleModal();
    const { employee } = useWorkspace();
    const { handleDeleteUser } = useStateUser();
    return (
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
            <h2 className="flex items-center gap-2 text-xl font-bold text-gray-800 mb-4 pb-3 border-b border-gray-100">
                <FcKey /> <span>Gestión de Usuario y Acceso</span>
            </h2>

            {data.user ? (
            <>
                <AlertMessage>
                    <div className='flex gap-4 items-center'>
                        <p className="font-bold">Inicio de sesión</p>
                        <Button size='sm' color='yellow' onClick={ ()=> openEmployeeModal('editUser')}><BiPencil/> Editar</Button>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                        <div>
                            <div>
                                <span className="font-semibold text-gray-700">Email:</span> <span className="font-mono text-gray-900">{data.user.email}</span>
                            </div>
                            <div>
                                <span className="font-semibold text-gray-700">Nombre de usuario:</span> <span className="font-mono text-gray-900">{data.user.username}</span>
                            </div>
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
                <AlertMessage className='mt-4'>
                    <div className="font-bold mb-1 flex gap-2">
                        <span>Roles Asignados</span> 
                        <Button color='blue' size='sm'><BiAddToQueue/> Agregar</Button>
                    </div>
                    <div className="text-sm flex gap-2 flex-col">
                        { data.user.userRoles?.map(item => (
                            <div className='border p-4 rounded-lg'>
                                <div className='flex gap-2'>
                                    <Button color='yellow' size='sm' onClick={()=> handleOpenModal(item)}><BiPencil/> Editar</Button>
                                    <Button color='red' size='sm'><BiTrash/> Eliminar</Button>
                                </div>
                                <div>
                                    <span className="font-semibold text-gray-700">{item.role?.name}: </span> 
                                    <span className="font-mono text-gray-900">{item.role?.description}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </AlertMessage>
            </>
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
            <EmployeeUpdateUserRoleModal 
                roles={userRoles}/>
            <EmployeeUpdateUserModal />
            <FloatMessage 
                {...floatMessageState}/>
        </div>
    )
}

export { EmployeeUserInformation };
