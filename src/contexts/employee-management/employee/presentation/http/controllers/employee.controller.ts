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
  ParseIntPipe,
  Patch,
} from '@nestjs/common';
// import { ApiTags, ApiResponse, ApiOperation } from '@nestjs/swagger'; // Para documentación de Swagger (opcional, pero buena práctica)
import { RegisterEmployeeRoleUseCase } from '../../../application/use-cases/register-employee.use-case';
import { FindEmployeeByIdUseCase } from '../../../application/use-cases/find-employee-by-id.use-case'; // DTO de entrada de la aplicación
import { EmployeeResponseDto } from '../../../application/dtos/employee-response.dto'; // DTO de salida de la aplicación
import { EmployeeMapper } from '../../../application/mappers/employee.mapper';

// DTOs específicos de presentación para validación con class-validator (opcional, pero es común)
import { ParamIdDto } from 'src/shared/presentation/http/dtos/param-id.dto';
import { InvalidEmployeeException } from '../../../domain/exceptions/invalid-employee.exception';
import { EmployeeAlreadyExistsException } from '../../../domain/exceptions/employee-already-exists.exception';
import { RegisterEmployeeRequestDto } from '../dtos/register-employee-request.dto';
import { RegisterEmployeeDto } from '../../../application/dtos/register-employee.dto';
import { FindAllEmployeeByEstablishmentIdUseCase } from '../../../application/use-cases/find-all-employee-by-establishment-id.use-case';
import { UpdateEmployeeRequestDto } from '../dtos/update-employee-request.dto';
import { UpdateEmployeeUseCase } from '../../../application/use-cases/update-employee.use-case';
import { UpdateEmployeeDto } from '../../../application/dtos/update-employee.dto';

/**
 * EducationalCenterController es el controlador de NestJS que maneja las solicitudes HTTP
 * relacionadas con la gestión de centros educativos.
 *
 * Es parte de la capa de Presentación y actúa como un Adaptador que convierte
 * solicitudes HTTP en llamadas a Casos de Uso de la capa de Aplicación.
 */
// @ApiTags('Educational Centers') // Etiqueta para Swagger
@Controller('employees') // Ruta base para este controlador
export class EmployeeController {
  constructor(
    // Inyectamos los Casos de Uso. El controlador no tiene lógica de negocio.
    private readonly registerEmployeeRoleUseCase: RegisterEmployeeRoleUseCase,
    private readonly updateEmployeeUseCase: UpdateEmployeeUseCase,
    private readonly findEmployeeRoleByIdUseCase: FindEmployeeByIdUseCase,
    private readonly findAllEmployeeByEstablishmentIdUseCase: FindAllEmployeeByEstablishmentIdUseCase,
  ) {}

  /**
   * Endpoint para registrar un nuevo establecimiento.
   *
   * @param registerDto Los datos del establecimiento a registrar.
   * @returns El DTO de respuesta del establecimiento creado.
   */
  @Post()
  @HttpCode(HttpStatus.CREATED) // Código de estado HTTP 201 para creación exitosa
  async registerEmployee(
    @Body() registerRequestDto: RegisterEmployeeRequestDto, // Usamos un DTO de Request para validación
  ): Promise<EmployeeResponseDto> {
    try {
      // Mapear el DTO de request de presentación al DTO de aplicación
      const registerAppDto = new RegisterEmployeeDto(
        registerRequestDto.branchOfficeId,
        registerRequestDto.employeeRoleId,
        registerRequestDto.firstName,
        registerRequestDto.lastName,
        registerRequestDto.email ?? null,
        registerRequestDto.phoneNumber,
        registerRequestDto.birthDate ?? null,
        registerRequestDto.gender ?? null,
        registerRequestDto.hireDate,
        registerRequestDto.terminationDate ?? null,
        registerRequestDto.entryTime ?? null,
        registerRequestDto.exitTime ?? null,
        registerRequestDto.currentSalary,
        registerRequestDto.isActive,
        registerRequestDto.photoUrl ?? null,
        registerRequestDto.address? {
          city: registerRequestDto.address.city,
          country: registerRequestDto.address.country,
          externalNumber: registerRequestDto.address.externalNumber ?? null,
          internalNumber: registerRequestDto.address.internalNumber ?? null,
          municipality: registerRequestDto.address.municipality,
          neighborhood: registerRequestDto.address.neighborhood ?? null,
          postalCode: registerRequestDto.address.postalCode,
          reference: registerRequestDto.address.reference ?? null,
          state: registerRequestDto.address.state,
          street: registerRequestDto.address.street ?? null,
        }: null
      );
      // Ejecutar el caso de uso
      const employee = await this.registerEmployeeRoleUseCase.execute(registerAppDto);
      // Mapear la entidad de dominio a DTO de respuesta
      return EmployeeMapper.toResponseDto(employee);
    } catch (error) {
      // *** TRADUCCIÓN DE EXCEPCIONES DE DOMINIO A EXCEPCIONES HTTP DE NESTJS ***
      if (error instanceof InvalidEmployeeException) {
        throw new BadRequestException(error.message); // Mapea InvalidNameException a 400 Bad Request
      }

      if (error instanceof EmployeeAlreadyExistsException) {
        throw new ConflictException(error.message);
      }

      // Si es un error desconocido o no esperado, relanzarlo o lanzar un InternalServerErrorException
      throw error; // Deja que el filtro global de excepciones lo maneje como 500
    }
  }
  @Patch(':employeeId')
  @HttpCode(HttpStatus.OK) // Código de estado HTTP 201 para creación exitosa
  async updateEmployee(
    @Param('employeeId', ParseIntPipe) employeeId: bigint,
    @Body() updateRequestDto: UpdateEmployeeRequestDto, // Usamos un DTO de Request para validación
  ): Promise<EmployeeResponseDto> {
    try {
      // Mapear el DTO de request de presentación al DTO de aplicación
      const updateAppDto = new UpdateEmployeeDto(
        updateRequestDto.branchOfficeId,
        updateRequestDto.employeeRoleId,
        updateRequestDto.firstName,
        updateRequestDto.lastName,
        updateRequestDto.email,
        updateRequestDto.phoneNumber,
        updateRequestDto.birthDate,
        updateRequestDto.gender,
        updateRequestDto.hireDate,
        updateRequestDto.terminationDate,
        updateRequestDto.entryTime,
        updateRequestDto.exitTime,
        updateRequestDto.currentSalary,
        !!updateRequestDto.isActive,
        updateRequestDto.photoUrl,
      );
      // Ejecutar el caso de uso
      const employee = await this.updateEmployeeUseCase.execute(employeeId, updateAppDto);
      // Mapear la entidad de dominio a DTO de respuesta
      return EmployeeMapper.toResponseDto(employee);
    } catch (error) {
      // *** TRADUCCIÓN DE EXCEPCIONES DE DOMINIO A EXCEPCIONES HTTP DE NESTJS ***
      if (error instanceof InvalidEmployeeException) {
        throw new BadRequestException(error.message); // Mapea InvalidNameException a 400 Bad Request
      }

      if (error instanceof EmployeeAlreadyExistsException) {
        throw new ConflictException(error.message);
      }

      // Si es un error desconocido o no esperado, relanzarlo o lanzar un InternalServerErrorException
      throw error; // Deja que el filtro global de excepciones lo maneje como 500
    }
  }

  @Get('all/establishments/:establishmentId')
  @HttpCode(HttpStatus.OK)
  async findAllEmployeeByEstablishmentId(
    @Param('establishmentId', ParseIntPipe) establishmentId: bigint,
  ) {
    try {
    const result = await this.findAllEmployeeByEstablishmentIdUseCase.execute(establishmentId);

    return {
      employees: result.map(item => EmployeeMapper.toResponseDto(item))
    };
    } catch (error) {
      throw error; // Deja que el filtro global de excepciones lo maneje
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
  async findEemployeeRoleById(
    @Param() params: ParamIdDto,
  ): Promise<EmployeeResponseDto> {
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
    return EmployeeMapper.toResponseDto(employeeRole);
    } catch (error) {
      throw error; // Deja que el filtro global de excepciones lo maneje
    }
  }

  // Otros endpoints como PUT para actualización, DELETE para borrado, etc.
}
