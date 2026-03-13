import { UserResponseDTO } from "src/contexts/authentication-management/auth/application/dtos/user-response.dto";
import { EmployeeRoleResponseDto } from "src/contexts/employee-management/employee-role/application/dtos/employee-role-response.dto";
import { AddressResponseDTO } from "src/shared/application/dtos/address-response.dto";

/**
 * EmployeeRole ResponseDto es un Data Transfer Object (DTO)
 * que define la estructura de los datos que se enviarán como respuesta
 * a la capa de presentación después de una operación relacionada con
 * un EmployeeRole  (ej. creación, consulta).
 *
 * Contiene solo los datos de salida relevantes, mapeados desde la entidad de dominio.
 */
export class EmployeeResponseDto {
  readonly employeeId: string; // El ID del rol del empleado (como string para compatibilidad JSON)
  readonly branchOfficeId: string; // El ID de la sucursal
  readonly employeeRoleId: string; // El ID del rol del empleado
  readonly addressId: string | null; // El ID de la dirección del empleado (puede ser nulo)
  readonly firstName: string; // El nombre del empleado
  readonly lastName: string; // El apellido del empleado
  readonly email: string | null; // El correo electrónico del empleado
  readonly phoneNumber: string | null; // El número de teléfono del empleado (puede ser nulo)
  readonly birthDate: Date | null; // La fecha de nacimiento del empleado (puede ser nulo)
  readonly gender: string | null; // El género del empleado (puede ser nulo)
  readonly hireDate: Date|null; // La fecha de contratación
  readonly terminationDate: Date | null; // La fecha de terminación (puede ser nulo)
  readonly entryTime: string | null; // La hora de entrada (puede ser nulo)
  readonly exitTime: string | null; // La hora de salida (puede ser nulo)
  readonly currentSalary: number|null; // El salario actual
  readonly isActive: boolean|null; // Estado de actividad
  readonly photoUrl: string | null; // URL de la foto del empleado (puede ser nulo)
  readonly createdAt: Date; // La fecha de creación
  readonly updatedAt: Date | null; // La fecha de la última actualización
  readonly deletedAt: Date | null; // La fecha de borrado lógico
  readonly employeeRole: EmployeeRoleResponseDto | null;
  readonly address: AddressResponseDTO| null; // Objeto que contiene los atributos de dirección
  readonly user: UserResponseDTO| null; 

  constructor(
    employeeId: string,
    branchOfficeId: string,
    employeeRoleId: string,
    addressId: string | null,
    firstName: string,
    lastName: string,
    email: string | null,
    createdAt: Date,
    phoneNumber: string | null,
    birthDate: Date | null,
    gender: string | null,
    hireDate: Date|null,
    terminationDate: Date | null,
    entryTime: string | null,
    exitTime: string | null,
    currentSalary: number | null,
    isActive: boolean,
    photoUrl: string | null,
    updatedAt: Date | null,
    deletedAt: Date | null,
    employeeRole: EmployeeRoleResponseDto | null,
    address: AddressResponseDTO | null,
    user: UserResponseDTO | null,
  ) {
    this.employeeId = employeeId;
    this.branchOfficeId = branchOfficeId;
    this.employeeRoleId = employeeRoleId;
    this.addressId = addressId;
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.phoneNumber = phoneNumber;
    this.birthDate = birthDate;
    this.gender = gender;
    this.hireDate = hireDate;
    this.terminationDate = terminationDate;
    this.entryTime = entryTime;
    this.exitTime = exitTime;
    this.currentSalary = currentSalary;
    this.isActive = isActive;
    this.photoUrl = photoUrl;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.deletedAt = deletedAt;
    this.employeeRole = employeeRole;
    this.address = address;
    this.user = user;
    Object.freeze(this);
  }
}