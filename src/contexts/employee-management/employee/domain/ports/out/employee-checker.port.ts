export const EMPLOYEE_CHECKER_PORT = Symbol('EMPLOYEE_CHECKER_PORT');
export interface EmployeeChekerPort{
    /**
     * @param employeeId El ID del empleado..
     * @return True si la marca existe, false en caso contrario.
     */
    exists(employeeId: bigint): Promise<boolean>;
}