export const EMPLOYEE_ROLE_CHECKER_PORT = Symbol('EMPLOYEE_ROLE_CHECKER_PORT');
export interface EmployeeRoleChekerPort{
    /**
     * @param employeeRoleId El ID del role para el empleado..
     * @return True si la marca existe, false en caso contrario.
     */
    exists(employeeRoleId: bigint): Promise<boolean>;
}