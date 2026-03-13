import { BadRequestException, Body, ConflictException, Controller, HttpCode, HttpStatus, NotFoundException, Param, Patch, Post } from "@nestjs/common";
import { RegisterBranchOfficeUseCase } from "../../application/use-cases/register-branch-office.use-case";
import { RegisterBranchOfficeRequestDto } from "../dtos/register-branch-office-request.dto";
import { BranchOfficeResponseDto } from "../../application/dtos/branch-office-response.dto";
import { RegisterBranchOfficeDto } from "../../application/dtos/register-branch-office.dto";
import { BranchOfficeMapper } from "../../application/mappers/branch-office.mapper";
import { InvalidBranchOfficeException } from "../../domain/exceptions/invalid-branch-office.exception";
import { InvalidAddressException } from "../../../../../shared/domain/exceptions/invalid-address.exception";
import { EstablishmentNotFoundException } from "src/contexts/establishment-management/establishment/domain/exceptions/establishment-not-found.exception";
import { UpdateBranchOfficeUseCase } from "../../application/use-cases/update-branch-office.use-case";
import { UpdateBranchOfficeRequestDto } from "../dtos/update-branch-office-request.dto";
import { UpdateBranchOfficeDto } from "../../application/dtos/update-branch-office.dto";
import { ParseBigIntPipe } from "src/shared/pipes/parse-bigint.pipe";
import { BranchOfficeNotFoundException } from "../../domain/exceptions/branch-office-not-found.exception";

/**
 * BranchOfficeController es el controlador de NestJS que maneja las solicitudes HTTP
 * relacionadas con la gestión de sucursales.
 *
 * Es parte de la capa de Presentación y actúa como un Adaptador que convierte
 * solicitudes HTTP en llamadas a Casos de Uso de la capa de Aplicación.
 */
@Controller('branch-offices')
export class BranchOfficeController {
  constructor(
    private readonly registerBranchOfficeUseCase: RegisterBranchOfficeUseCase,
    private readonly updateBranchOfficeUseCase: UpdateBranchOfficeUseCase,
  ) { }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async registerBranchOffice(
    @Body() registerRequestDto: RegisterBranchOfficeRequestDto, // Usamos un DTO de Request para validación
  ): Promise<BranchOfficeResponseDto> {
    try {
      // 1. Convertir el DTO de Request (validado por la capa de presentación)
      // al DTO de la capa de Aplicación.
      const registerAppDto = new RegisterBranchOfficeDto(
        registerRequestDto.name,
        {
          street: registerRequestDto.street ?? null,
          externalNumber: registerRequestDto.externalNumber ?? null,
          internalNumber: registerRequestDto.internalNumber ?? null,
          municipality: registerRequestDto.municipality,
          neighborhood: registerRequestDto.neighborhood ?? null,
          city: registerRequestDto.city,
          state: registerRequestDto.state,
          postalCode: registerRequestDto.postalCode,
          country: registerRequestDto.country,
          reference: registerRequestDto.reference ?? null,
        },
        registerRequestDto.establishmentId,
      );
      // ...removed commented console.log...

      // 2. Ejecutar el Caso de Uso (que contiene la orquestación de la lógica de negocio).
      const branchOffice = await this.registerBranchOfficeUseCase.execute(registerAppDto);

      // 3. Mapear la entidad de dominio resultante a un DTO de respuesta para la API.
      return BranchOfficeMapper.toResponseDto(branchOffice);
    } catch (error) {

      // *** TRADUCCIÓN DE EXCEPCIONES DE DOMINIO A EXCEPCIONES HTTP DE NESTJS ***
      if ((error instanceof InvalidBranchOfficeException) || (error instanceof InvalidAddressException)) {
        throw new BadRequestException(error.message); // Mapea InvalidNameException a 400 Bad Request
      }

      if (error instanceof EstablishmentNotFoundException) {
        throw new NotFoundException(error.message);
      }
      throw error; // Deja que el filtro global de excepciones lo maneje como 500
    }
  }
  @Patch(':branchOfficeId')
  @HttpCode(HttpStatus.OK)
  async updateBranchOffice(
    @Param('branchOfficeId', ParseBigIntPipe) branchOfficeId: bigint,
    @Body() dto: UpdateBranchOfficeRequestDto, // Usamos un DTO de Request para validación
  ): Promise<BranchOfficeResponseDto> {
    try {
      const updateDto = new UpdateBranchOfficeDto(
        dto.name ?? null,
        branchOfficeId,
      );
      const branchOffice = await this.updateBranchOfficeUseCase.execute(updateDto);

      return BranchOfficeMapper.toResponseDto(branchOffice);
    } catch (error) {

      // *** TRADUCCIÓN DE EXCEPCIONES DE DOMINIO A EXCEPCIONES HTTP DE NESTJS ***
      if ((error instanceof InvalidBranchOfficeException)) {
        throw new BadRequestException(error.message);
      }

      if (error instanceof BranchOfficeNotFoundException) {
        throw new NotFoundException(error.message);
      }
      throw error;
    }
  }
}