import {
  IsString,
  MaxLength,
  IsEmail,
  IsOptional,
  IsBoolean,
  IsDateString,
  IsNumber,
  Allow, // Importante para permitir null
} from 'class-validator';

export class UpdateEmployeeRequestDto {
  /*
   * -----------------------------------------------------------
   * CAMPOS OPCIONALES PERO NO ACEPTAN NULL NI UNDEFINED SI VIENEN
   * -----------------------------------------------------------
   */

  @IsOptional()
  branchOfficeId?: bigint;

  @IsOptional()
  employeeRoleId?: bigint;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  firstName?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  lastName?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  phoneNumber?: string;

  /*
   * -----------------------------------------------------------
   * CAMPOS OPCIONALES Y ACEPTAN NULL
   * -----------------------------------------------------------
   */

  /** Email */
  @IsOptional() // Puede no venir en el payload
  @Allow() // Acepta el valor explícito null
  // Nota: Ya no pasamos skipNull/skipUndefined aquí
  @IsEmail(
    {},
    { message: 'El formato debe ser el correcto, Ej: correo@email.com' },
  )
  email?: string | null;

  /** Fecha de nacimiento (opcional) */
  @IsOptional()
  @Allow()
  @IsDateString()
  birthDate?: string | null;

  /** Género (opcional) */
  @IsOptional()
  @Allow()
  @IsString()
  gender?: string | null;

  /** Fecha de contratación */
  @IsOptional()
  @Allow()
  @IsDateString()
  hireDate?: string | null;

  /** Fecha de baja (opcional) */
  @IsOptional()
  @Allow()
  @IsDateString()
  terminationDate?: string | null;

  /** Hora de entrada (opcional) */
  @IsOptional()
  @Allow()
  @IsString()
  entryTime?: string | null;

  /** Hora de salida (opcional) */
  @IsOptional()
  @Allow()
  @IsString()
  exitTime?: string | null;

  /** Salario actual */
  @IsOptional()
  @Allow()
  @IsNumber()
  currentSalary?: number | null;

  /** Activo */
  @IsOptional()
  @Allow()
  @IsBoolean()
  isActive?: boolean | null;

  /** URL de foto (opcional) */
  @IsOptional()
  @Allow()
  @IsString()
  photoUrl?: string | null;
}