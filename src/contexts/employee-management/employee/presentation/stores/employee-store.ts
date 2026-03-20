import { create } from "zustand";
import { EmployeeEntity } from "../../../../../features/employee/domain/entities/employee.entity";
import { UserRoleEntity } from "@/features/auth/domain/entities/user-role.entity";
interface State {
    employee: EmployeeEntity | null,
    setEmployee: (employee: EmployeeEntity|null) => void,
    userRoleSelected: UserRoleEntity | null,
    setUserRoleSelected: (payload: UserRoleEntity|null) => void,
}

const initialState = {
    employee: null,
    userRoleSelected: null
}

export const useEmployeeStore = create<State>()((set, get) => ({
    ...initialState,
    setEmployee: (employee: EmployeeEntity|null) => {
        set(()=>({
            employee
        }));
    },
    setUserRoleSelected(payload) {
        set(()=>({
            userRoleSelected: payload
        }))
    },
}));