'use client'

import { ICashRegister } from "@/contexts/cash-management/cash-register/presentation/interfaces/ICashRegister";
import { useAuth, useWorkspace } from "@/shared/presentation/hooks/auth/useAuth";

interface Props{
    cashRegisters: ICashRegister[]
}
const useCashRegisterList = ({ cashRegisters }:Props) => {
    const { user } = useAuth();
    const { employee } = useWorkspace();
    const currentCashRegisters = ()=> {
        if(user?.roles.find(item => item=== 'branch_office_management' || item=== 'establishment_manager' || item === 'global_admin' )){
            return cashRegisters;
        } else {
            if(user?.roles.find(item => item=== 'cajero')){
                let newList: ICashRegister[] = [];
                cashRegisters.forEach(subItem => {
                    if(subItem.cashSessions.length <= 0){
                        newList.push(subItem)
                    } else if(subItem.cashSessions.length >= 1){
                        if(subItem.cashSessions[0].employeeId === employee?.employeeId){
                            newList.push(subItem);
                        }
                    }
                });
                return newList;
            } else {
                return [];
            }
        }
    }
  return {
    currentCashRegisters
  }
}

export { useCashRegisterList };