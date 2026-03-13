// src/contexts/educational-center-management/educational-center/presentation/http/controllers/educational-center.controller.ts
import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  HttpStatus,
  HttpCode,
  BadRequestException,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
// import { ApiTags, ApiResponse, ApiOperation } from '@nestjs/swagger'; // Para documentación de Swagger (opcional, pero buena práctica)
import { RegisterEmployeeRoleUseCase } from '../../../application/use-cases/register-employee-role.use-case';
import { FindEmployeeRoleByIdUseCase } from '../../../application/use-cases/find-employee-role-by-id.use-case';
import { RegisterEmployeeRoleDto } from '../../../application/dtos/register-employee-role.dto'; // DTO de entrada de la aplicación
import { EmployeeRoleResponseDto } from '../../../application/dtos/employee-role-response.dto'; // DTO de salida de la aplicación
import { EmployeeRoleMapper } from '../../../application/mappers/employee-role.mapper';

// DTOs específicos de presentación para validación con class-validator (opcional, pero es común)
import { RegisterEmployeeRoleRequestDto } from '../dtos/register-employee-role-request.dto';
import { ParamIdDto } from 'src/shared/presentation/http/dtos/param-id.dto';
import { InvalidEmployeeRoleException } from '../../../domain/exceptions/invalid-employee-role.exception';
import { EmployeeRoleAlreadyExistsException } from '../../../domain/exceptions/employee-role-already-exists.exception';
import { FindAllEmployeeRoleUseCase } from '../../../application/use-cases/find-all-employee-role.use-case';

/**
 * EducationalCenterController es el controlador de NestJS que maneja las solicitudes HTTP
 * relacionadas con la gestión de centros educativos.
 *
 * Es parte de la capa de Presentación y actúa como un Adaptador que convierte
 * solicitudes HTTP en llamadas a Casos de Uso de la capa de Aplicación.
 */
// @ApiTags('Educational Centers') // Etiqueta para Swagger
@Controller('employee-roles') // Ruta base para este controlador
export class EmployeeRoleController {
  constructor(
    // Inyectamos los Casos de Uso. El controlador no tiene lógica de negocio.
    private readonly registerEmployeeRoleUseCase: RegisterEmployeeRoleUseCase,
    private readonly findEmployeeRoleByIdUseCase: FindEmployeeRoleByIdUseCase, // Se inyectará aquí
    private readonly findAllEmployeeRoleUseCase: FindAllEmployeeRoleUseCase,
  ) {}

  /**
   * Endpoint para registrar un nuevo establecimiento.
   *
   * @param registerDto Los datos del establecimiento a registrar.
   * @returns El DTO de respuesta del establecimiento creado.
   */
  @Post()
  @HttpCode(HttpStatus.CREATED) // Código de estado HTTP 201 para creación exitosa
  // @ApiOperation({ summary: 'Registrar un nuevo establecimiento.' })
  // @ApiResponse({
  //   status: 201,
  //   description: 'El establecimiento se ha creado correctamente.',
  //   type: EstablishmentResponseDto,
  // })
  // @ApiResponse({ status: 400, description: 'Invalid input data.' })
  // @ApiResponse({ status: 409, description: 'Educational center already exists.' })
  // @ApiResponse({ status: 500, description: 'Internal server error.' })
  async registerEstablishment(
    @Body() registerRequestDto: RegisterEmployeeRoleRequestDto, // Usamos un DTO de Request para validación
  ): Promise<EmployeeRoleResponseDto> {
    try {
      // 1. Convertir el DTO de Request (validado por la capa de presentación)
      // al DTO de la capa de Aplicación.
      const registerAppDto = new RegisterEmployeeRoleDto(registerRequestDto.name);

      // 2. Ejecutar el Caso de Uso (que contiene la orquestación de la lógica de negocio).
      const brand = await this.registerEmployeeRoleUseCase.execute(registerAppDto);
        
      // 3. Mapear la entidad de dominio resultante a un DTO de respuesta para la API.
      return EmployeeRoleMapper.toResponseDto(brand);
    } catch (error) {
      // *** TRADUCCIÓN DE EXCEPCIONES DE DOMINIO A EXCEPCIONES HTTP DE NESTJS ***
      if (error instanceof InvalidEmployeeRoleException) {
        throw new BadRequestException(error.message); // Mapea InvalidNameException a 400 Bad Request
      }

      if(error instanceof EmployeeRoleAlreadyExistsException){
        throw new ConflictException(error.message);
      }
      // Si es un error desconocido o no esperado, relanzarlo o lanzar un InternalServerErrorException
      throw error; // Deja que el filtro global de excepciones lo maneje como 500
    }
  }

  /**
   * Endpoint para buscar un establecimiento por su ID.
   *
   * @param params El DTO que contiene el ID del establecimiento.
   * @returns El DTO de respuesta del establecimiento encontrado.
   */
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  // @ApiOperation({ summary: 'Buscar un establecimiento por su ID.' })
  // @ApiResponse({
  //   status: 200,
  //   description: 'The educational center found.',
  //   type: EstablishmentResponseDto,
  // })
  // @ApiResponse({ status: 404, description: 'Educational center not found.' })
  async findEemployeeRoleById(
    @Param() params: ParamIdDto,
  ): Promise<EmployeeRoleResponseDto> {
    try {
      // 1. El DTO de parámetro ya ha sido validado por la capa de presentación (ej. con class-validator).
    const employeeRoleId = BigInt(params.id); // Convertimos el string a BigInt para el dominio

    // 2. Ejecutar el Caso de Uso para encontrar el centro.
    const employeeRole =
      await this.findEmployeeRoleByIdUseCase.execute(employeeRoleId);

    if (!employeeRole) {
      // Lanzar una excepción de NestJS que se mapee a un 404
      throw new NotFoundException('Rol no encontrado.'); // O una excepción personalizada de NestJS
    }

    // 3. Mapear la entidad de dominio a un DTO de respuesta.
    return EmployeeRoleMapper.toResponseDto(employeeRole);
    } catch (error) {
      throw error; // Deja que el filtro global de excepciones lo maneje
    }
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAllEmployeeRole(){
    const result = await this.findAllEmployeeRoleUseCase.execute();
    return {
      employeeRoles: result.map( item => EmployeeRoleMapper.toResponseDto(item))
    }
  }
  // Otros endpoints como PUT para actualización, DELETE para borrado, etc.
}
