import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { RegisterPermissionUseCase } from '../../application/use-cases/register-permission.use-case';
import { RegisterPermissionDto } from '../../application/dtos/register-permission.dto';
import { RegisterPermissionRequestDto } from '../dtos/register-permission-request.dto';
import { PermissionMapper } from '../../application/mappers/permission-mapper';
import { InvalidPermissionException } from '../../domain/exceptions/invalid-permission.exception';
import { PermissionAlreadyExistsException } from '../../domain/exceptions/permission-already-exists.exception';

@Controller('permissions')
export class PermissionController {
  constructor(private readonly registerPermissionUseCase: RegisterPermissionUseCase) {}

  @Post()
  @HttpCode(HttpStatus.CREATED) // Código de estado HTTP 201 para creación exitosa
  async registerRole(
    @Body()
    registerRequestDto: RegisterPermissionRequestDto,
  ) {
    try {
      const registerAppDto = new RegisterPermissionDto(
        registerRequestDto.name,
        registerRequestDto.description,
      );

      const permission = await this.registerPermissionUseCase.execute(registerAppDto);
      return PermissionMapper.toResponseDto(permission);
    } catch (error) {
      
      // *** TRADUCCIÓN DE EXCEPCIONES DE DOMINIO A EXCEPCIONES HTTP DE NESTJS ***
      if (error instanceof InvalidPermissionException) {
        throw new BadRequestException(error.message); // Mapea InvalidNameException a 400 Bad Request
      }

      if (error instanceof PermissionAlreadyExistsException) {
        throw new ConflictException(error.message);
      }

      // Codigo de error que lanza typeorm cuando ya existe un centro educativo con el mismo nombre
      // Mapea errores de conflicto de la base de datos (ej. duplicados) a 409 Conflict
      // Otros tipos de errores de dominio si existieran
      // if (error instanceof AnotherDomainException) { /* ... */ }
      // Si es un error desconocido o no esperado, relanzarlo o lanzar un InternalServerErrorException
      throw error; // Deja que el filtro global de excepciones lo maneje como 500
    }
  }
}
