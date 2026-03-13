import { Type } from "class-transformer";
import { IsBoolean, IsEmail, IsNotEmpty, IsNumberString, IsOptional, IsString, MaxLength, MinLength, ValidateNested } from "class-validator";
import { RegisterAddressRequestDTO } from "src/shared/presentation/http/dtos/register-address.resquest.dto";

export class RegisterCustomerRequestDto {
    @IsNumberString()
    @IsNotEmpty({message: 'El id del establecimeinto no puede estar vacío.'})
    establishmentId: bigint;
    @IsString({ message: 'El nombre no puede ser un número.' })
    @IsNotEmpty({ message: 'El nombre no puede estar vacío.' })
    @MinLength(3, { message: 'El nombre debe tener como mínimo 3 caracteres.' })
    @MaxLength(100, { message: 'El nombre no debe ser mayor a 100 caracteres.' })
    firstName: string;
    @IsBoolean({message: 'Habilita o desabilita el cliente por defecto'})
    @IsNotEmpty({message: 'El campo para venta por defecto es obligatorio.'})
    saleDefault: boolean;
    @IsOptional()
    @IsString({ message: 'Los apellidos no pueden ser un número.' })
    @MinLength(3, { message: 'Los apellidos deben tener como mínimo 3 caracteres.' })
    @MaxLength(100, { message: 'Los apellidos no deben ser mayor a 100 caracteres.' })
    lastName?: string|null;
    @IsOptional()
    @IsString({ message: 'El nombre de la compañía no puede ser un número.' })
    @MinLength(3, { message: 'El nombre de la compañía debe tener como mínimo 3 caracteres.' })
    @MaxLength(100, { message: 'El nombre de la compañía no debe ser mayor a 150 caracteres.' })
    companyName?: string|null;
    @IsOptional()
    @IsString({ message: 'El número de teléfono es una cadena numerica.' })
    @MinLength(3, { message: 'El número de teléfono debe tener como mínimo 3 caracteres.' })
    @MaxLength(25, { message: 'El número de teléfono no debe ser mayor a 25 caracteres.' })
    phoneNumber?: string|null;
    @IsOptional()
    @IsString({ message: 'El RFC es una cadena alfanumerica.' })
    @MinLength(3, { message: 'El RFC debe tener como mínimo 3 caracteres.' })
    @MaxLength(13, { message: 'El RFC no debe ser mayor a 13 caracteres.' })
    rfc?: string | null;
    @IsOptional()
    @IsString({ message: 'El nombre de la persona de contacto es una cadena de texto.' })
    @MinLength(3, { message: 'El nombre de la persona de contacto debe tener como mínimo 3 caracteres.' })
    @MaxLength(100, { message: 'El nombre de la persona de contacto no debe ser mayor a 100 caracteres.' })
    contactPerson?: string | null;
    @IsOptional()
    @IsEmail({},{ message: "El correo electrónico debe tener la estrcutura 'ejemplo@domain.com'" })
    @MinLength(3, { message: 'El correo electrónico debe tener como mínimo 3 caracteres.' })
    @MaxLength(100, { message: 'El correo electrónico no debe ser mayor a 100 caracteres.' })
    email?: string | null;
    @IsOptional()
    @IsString({ message: 'El tipo de cleinte es una cadena de texto.' })
    @MinLength(3, { message: 'El tipo de cleinte debe tener como mínimo 3 caracteres.' })
    @MaxLength(50, { message: 'El tipo de cleinte no debe ser mayor a 50 caracteres.' })
    customerType?: string | null;
    @IsOptional()
    @ValidateNested()
    @Type(() => RegisterAddressRequestDTO)
    address?: RegisterAddressRequestDTO |null; // Dirección del cliente
  }