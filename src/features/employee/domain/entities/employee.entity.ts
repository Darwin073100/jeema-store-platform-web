import { AddressEntity } from "@/shared/domain/entities/address.entity";
import { EmployeeRoleEntity } from "./employee-role.entity";
import { UserEntity } from "@/features/auth/domain/entities/user.entity";

export interface EmployeeEntity {
    employeeId       : bigint; // El ID del rol del empleado (como string para compatibilidad JSON)
    branchOfficeId   : bigint; // El ID de la sucursal
    employeeRoleId   : bigint; // El ID del rol del empleado
    addressId        : bigint | null; // El ID de la dirección del empleado (puede ser nulo)
    firstName        : string; // El nombre del empleado
    lastName         : string; // El apellido del empleado
    email            : string; // El correo electrónico del empleado
    phoneNumber?     : string | null; // El número de teléfono del empleado (puede ser nulo)
    birthDate?       : Date | null; // La fecha de nacimiento del empleado (puede ser nulo)
    gender?          : string | null; // El género del empleado (puede ser nulo)
    hireDate?        : Date | null; // La fecha de contratación
    terminationDate? : Date | null; // La fecha de terminación (puede ser nulo)
    entryTime?       : string | null; // La hora de entrada (puede ser nulo)
    exitTime?        : string | null; // La hora de salida (puede ser nulo)
    currentSalary?   : number | null; // El salario actual
    isActive?        : boolean | null; // Estado de actividad
    photoUrl?        : string | null; // URL de la foto del empleado (puede ser nulo)
    createdAt        : Date; // La fecha de creación
    updatedAt?       : Date | null; // La fecha de la última actualización
    deletedAt?       : Date | null; // La fecha de eliminación (puede ser nulo)
    address?         : AddressEntity| null;
    employeeRole?    : EmployeeRoleEntity| null;
    user?            : UserEntity | null;
}