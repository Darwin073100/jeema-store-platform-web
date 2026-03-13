import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Post,
} from '@nestjs/common';
import { RegisterRoleUseCase } from '../../application/use-cases/register-role.use-case';
import { RegisterRoleDto } from '../../application/dtos/register-role.dto';
import { RegisterRoleRequestDto } from '../dtos/register-role-request.dto';
import { InvalidRoleException } from '../../domain/exceptions/invalid-role.exception';
import { RoleAlreadyExistException } from '../../domain/exceptions/role-already.exception';
import { RolePermissionMapper } from '../../application/mappers/role-permission.mapper';
import { NotFoundRoleException } from '../../domain/exceptions/not-found-role.exception';
import { FindAllRoleUseCase } from '../../application/use-cases/find-all-role.use-case';
import { RoleMapper } from '../../application/mappers/role.mapper';

@Controller('roles')
export class RoleController {
  constructor(
    private readonly registerRoleUseCase: RegisterRoleUseCase,
    private readonly findAllRoleUseCase: FindAllRoleUseCase,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED) // Código de estado HTTP 201 para creación exitosa
  async registerRole(
    @Body()
    registerRequestDto: RegisterRoleRequestDto,
  ) {
    try {
      const registerAppDto = new RegisterRoleDto(
        registerRequestDto.permissionId,
        registerRequestDto.name,
        registerRequestDto.description,
      );

      const rolePermission = await this.registerRoleUseCase.execute(registerAppDto);
      return RolePermissionMapper.toResponseDto(rolePermission);
    } catch (error) {
      // *** TRADUCCIÓN DE EXCEPCIONES DE DOMINIO A EXCEPCIONES HTTP DE NESTJS ***
      if (error instanceof InvalidRoleException) {
        throw new BadRequestException(error.message); // Mapea InvalidNameException a 400 Bad Request
      }

      if (error instanceof RoleAlreadyExistException) {
        throw new ConflictException(error.message);
      }

      if(error instanceof NotFoundRoleException){
        throw new NotFoundException(error.message);
      }

      // Codigo de error que lanza typeorm cuando ya existe un centro educativo con el mismo nombre
      // Mapea errores de conflicto de la base de datos (ej. duplicados) a 409 Conflict
      // Otros tipos de errores de dominio si existieran
      // if (error instanceof AnotherDomainException) { /* ... */ }
      // Si es un error desconocido o no esperado, relanzarlo o lanzar un InternalServerErrorException
      throw error; // Deja que el filtro global de excepciones lo maneje como 500
    }
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(){
    try {
      const result = await this.findAllRoleUseCase.execute();
      return {
        roles: result.map( item => RoleMapper.toResponseDto(item))
      };
    } catch (error) {
      throw error;
    }
  }
}
