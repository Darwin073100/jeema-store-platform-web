'use client';
import { useEmployeeUIStore } from "../../stores/employee-ui.store";
import { useEmployeeStore } from "../../stores/employee-store";
import { UserRoleEntity } from "@/features/auth/domain/entities/user-role.entity";
import { deleteUserRoleAction } from "@/features/auth/actions/delete-user-role.action";

const useEmployeeDeleteUserRoleModal = () => {
    const { 
        floatMessageState, setFloatMessageState, closeEmployeeModal, openEmployeeModal, employeeModal, 
        loading, runLoading, stopLoading
    } = useEmployeeUIStore();
    const {setUserRoleSelected, userRoleSelected} = useEmployeeStore();

    const handleOpenModalUserRoleDelete = (userRole: UserRoleEntity)=> {
        openEmployeeModal('deleteUserRole');
        setUserRoleSelected(userRole);
    }

    const onSubmit = async () => {
        runLoading('deleteUserRole');
        const result = await deleteUserRoleAction(BigInt(userRoleSelected?.userRoleId ?? BigInt(0)));
        stopLoading();
        if(result.ok){
            setFloatMessageState({
                summary: '¡Correcto 😁!',
                description: 'Rol eliminado correctamente',
                isActive: true,
                type: 'green'  
            });
            closeEmployeeModal();
            setTimeout(()=>{
                setFloatMessageState({});
            }, 2500);
        } else {
            setFloatMessageState({
                summary: `${result.error?.statusCode}: ¡Error 😐!`,
                description: result.error?.message ??'Error al eliminar el rol del usuario',
                isActive: true,
                type: 'red'
            });
            setTimeout(()=>{
                setFloatMessageState({});
            }, 4000);
        }
    }
    return {
        onSubmit,
        handleOpenModalUserRoleDelete,
        floatMessageState,
        loading,
        closeEmployeeModal,
        openEmployeeModal,
        employeeModal,
    }
}

export { useEmployeeDeleteUserRoleModal };