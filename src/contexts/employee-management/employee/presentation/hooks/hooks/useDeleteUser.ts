import { updateUserAction } from "@/features/auth/actions/update-user.action";
import { useEmployeeUIStore } from "../../stores/employee-ui.store";

const useStateUser = () => {
    const { loading, runLoading, stopLoading, setFloatMessageState } = useEmployeeUIStore();
    
    const handleDeleteUser = async (userId: bigint, isActive: boolean)=> {
        runLoading('stateUser');
        const result = await updateUserAction(userId, {isActive: !isActive});
        stopLoading();
        if(result.ok){
            setFloatMessageState({
                type: 'green',
                isActive: true,
                summary: '¡Correcto!',
                description: `Usuario ${isActive? 'desactivado': 'activado'}`
            });
            setTimeout(()=>{
                setFloatMessageState({});
            }, 2000);
        } else {
            setFloatMessageState({
                type: 'red',
                isActive: true,
                summary: `${result.error?.message}:¡Error!`,
                description: `No se pudo ejecutar la acción.`
            });
            setTimeout(()=>{
                setFloatMessageState({});
            }, 3500);
        }
    }

    return {
        handleDeleteUser,
        loading
    }
}

export { useStateUser };
