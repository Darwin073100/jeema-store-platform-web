/**
 * DTO para registrar un empleado. Valida los datos de entrada de la API.
 */
import { IsNotEmpty, IsString, MaxLength, IsEmail, IsOptional, IsBoolean, IsDateString, IsObject, ValidateNested, IsNumberString, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';
import { RegisterAddressRequestDTO } from 'src/shared/presentation/http/dtos/register-address.resquest.dto';
import { RegisterUserWithOutEmployeeIdRequestDTO } from 'src/contexts/authentication-management/auth/presentation/http/dtos/register-user-without-employee-Id.request.dto';

/**
 * DTO principal para alta de empleado.
 */
export class RegisterEmployeeRequestDto {
  /** ID de la sucursal */
  @IsNumberString({},{message: 'El id de la sucursal debe ser una cadena numérica.'})
  @IsNotEmpty({message: 'El id de la sucursal es requerido.'})
  branchOfficeId: bigint;
  /** ID del rol */
  @IsNumberString({},{message: 'El id del rol del empleado debe ser una cadena numérica.'})
  @IsNotEmpty({message: 'El id del rol del empleado es requerido.'})
  employeeRoleId: bigint;
  /** Nombre(s) */
  @IsString({message: 'El nombre del empleado es una cadena de texto.'})
  @IsNotEmpty({message: 'El nombre del empleado es requerido'})
  @MaxLength(100)
  firstName: string;
  /** Apellido(s) */
  @IsString({message: 'Los apellidos empleado es una cadena de texto.'})
  @IsNotEmpty({message: 'Los apellidos del empleado es requerido'})
  @MaxLength(100)
  lastName: string;
  /** Email */
  @IsOptional()
  @IsEmail({},{message: 'El formato debe ser el correcto, Ej: correo@email.com'})
  email?: string | null;
  /** Teléfono */
  @IsString()
  @IsNotEmpty({message: 'El numero de telefono es obligatorio.'})
  @MaxLength(20)
  phoneNumber: string;
  /** Fecha de nacimiento (opcional) */
  @IsOptional()
  @IsDateString({}, { message: 'La fecha de cumpleaños debe ser una fecha válida (YYYY-MM-DD).' })
  birthDate?: string | null;

  /** Género (opcional) */
  @IsOptional()
  @IsString()
  gender?: string | null;

  /** Fecha de contratación */
  @IsDateString()
  @IsNotEmpty()
  hireDate: string;

  /** Fecha de baja (opcional) */
  @IsOptional()
  @IsDateString()
  terminationDate?: string | null;

  /** Hora de entrada (opcional) */
  @IsOptional()
  @IsString()
  entryTime?: string | null;

  /** Hora de salida (opcional) */
  @IsOptional()
  @IsString()
  exitTime?: string | null;

  /** Salario actual */
  @IsNotEmpty()
  @IsNumber()
  currentSalary: number;

  /** Activo */
  @IsBoolean()
  isActive: boolean;

  /** URL de foto (opcional) */
  @IsOptional()
  @IsString()
  photoUrl?: string | null;

  /** Dirección */
  @IsOptional()
  @ValidateNested()
  @Type(() => RegisterAddressRequestDTO)
  address?: RegisterAddressRequestDTO | null;
  // /** Dirección */
  // @IsOptional()
  // @ValidateNested()
  // @Type(() => RegisterUserWithOutEmployeeIdRequestDTO)
  // user?: RegisterUserWithOutEmployeeIdRequestDTO | null;
}