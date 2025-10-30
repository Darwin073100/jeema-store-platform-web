import { create } from "zustand";
import { EmployeeEntity } from "../../domain/entities/employee.entity";
interface State {
    employee: EmployeeEntity | null,
    setEmployee: (employee: EmployeeEntity|null) => void,
}

const initialState = {
    employee: null,
}

export const useEmployeeStore = create<State>()((set, get) => ({
    ...initialState,
    setEmployee: (employee: EmployeeEntity|null) => {
        set(()=>({
            employee
        }));
    }
}));