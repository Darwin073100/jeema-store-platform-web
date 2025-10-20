'use client';
import { useEmployeeUIStore } from "../stores/employee-ui.store";
import * as yup from 'yup';

export const schema = yup.object().shape({
    
});
const useEmployeeForm = () => {
    const { setAddressStateCheck, setUserStateCheck } = useEmployeeUIStore();
    const handleUserCheck = (e: React.ChangeEvent<HTMLInputElement>)=>{
        setUserStateCheck(!!e.target.checked.valueOf());
    }
    const handleAddressCheck = (e: React.ChangeEvent<HTMLInputElement>)=>{
        setAddressStateCheck(!!e.target.checked);
    }
    return {
        handleAddressCheck,
        handleUserCheck
    }
}

export { useEmployeeForm };