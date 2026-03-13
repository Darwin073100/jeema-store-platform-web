import { IsNotEmpty, IsNumberString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterSaleRequestDto {
    @ApiProperty({ description: 'ID de la sucursal' })
    @IsNotEmpty({ message: 'El ID de la sucursal es requerido' })
    @IsNumberString({}, { message: 'El ID de la sucursal debe ser una cadena numerica.' })
    readonly branchOfficeId: bigint;

    @ApiProperty({ description: 'ID del cliente' })
    @IsNotEmpty({ message: 'El ID del cliente es requerido' })
    @IsNumberString({}, { message: 'El ID del cliente debe ser una cadena numerica.' })
    readonly customerId: bigint;

    @ApiProperty({ description: 'ID del empleado' })
    @IsNotEmpty({ message: 'El ID del empleado es requerido' })
    @IsNumberString({}, { message: 'El ID del empleado debe ser una cadena numerica.' })
    readonly employeeId: bigint;
    
    @ApiProperty({ description: 'ID de la caja' })
    @IsNotEmpty({ message: 'El ID de la caja es requerido' })
    @IsNumberString({}, { message: 'El ID de la caja debe ser una cadena numerica.' })
    readonly cashRegisterId: bigint;
}