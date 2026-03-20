import { create } from "zustand";
import { UserRoleEntity } from "@/features/auth/domain/entities/user-role.entity";
import { IEmployee } from "../interfaces/IEmployee";
interface State {
    employee: IEmployee | null,
    setEmployee: (employee: IEmployee|null) => void,
    userRoleSelected: UserRoleEntity | null,
    setUserRoleSelected: (payload: UserRoleEntity|null) => void,
}

const initialState = {
    employee: null,
    userRoleSelected: null
}

export const useEmployeeStore = create<State>()((set, get) => ({
    ...initialState,
    setEmployee: (employee: IEmployee|null) => {
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