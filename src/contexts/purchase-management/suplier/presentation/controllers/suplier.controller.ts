import { BadRequestException, Body, ConflictException, Controller, Get, HttpCode, HttpStatus, NotFoundException, Post } from "@nestjs/common";
import { RegisterSuplierUseCase } from "../../application/use-cases/register-suplier.use-case";
import { RegisterSuplierRequestDto } from "../dtos/register-suplier-request.dto";
import { SuplierResponseDto } from "../../application/dtos/suplier-response.dto";
import { RegisterSuplierDto } from "../../application/dtos/register-suplier.dto";
import { SuplierMapper } from "../../application/mappers/suplier.mapper";import { InvalidSuplierException } from "../../domain/exceptions/invalid-suplier.exception";
import { InvalidAddressException } from "../../../../../shared/domain/exceptions/invalid-address.exception";import { SuplierAlreadyExistsException } from "../../domain/exceptions/suplier-already-exists.exception";
import { SuplierNotFoundException } from "../../domain/exceptions/suplier-not-found.exception";
import { FindAllSuplierByEstablishmentRequestDTO } from "../dtos/find-all-suplier-by-establishment-request.dto";
import { FindAllSuplierByEstablishmentUseCase } from "../../application/use-cases/find-all-supliers-by-establishment.use-case";

/**
 * SuplierController es el controlador de NestJS que maneja las solicitudes HTTP
 * relacionadas con la gestión de proveedores.
 *
 * Es parte de la capa de Presentación y actúa como un Adaptador que convierte
 * solicitudes HTTP en llamadas a Casos de Uso de la capa de Aplicación.
 */
@Controller('supliers')
export class SuplierController{
    constructor(
        private readonly registerSupliersUseCase: RegisterSuplierUseCase,
        private readonly findAllSuplierByEstablishmentUseCase: FindAllSuplierByEstablishmentUseCase
    ){}

    @Post('all/establishments')
    @HttpCode(HttpStatus.OK)
    async findAllByEstablishment(@Body() dto: FindAllSuplierByEstablishmentRequestDTO){
      const result = await this.findAllSuplierByEstablishmentUseCase.execute(dto.establishmentId, dto.isAddress ?? false);
      return {
        supliers: result.map(item => SuplierMapper.toResponseDto(item))
      }
    }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    async registerSuplier(
        @Body() registerRequestDto: RegisterSuplierRequestDto, // Usamos un DTO de Request para validación
      ): Promise<SuplierResponseDto> {
        try {
          // 1. Convertir el DTO de Request (validado por la capa de presentación)
          // al DTO de la capa de Aplicación.
          const registerAppDto = new RegisterSuplierDto(
            registerRequestDto.establishmentId,
            registerRequestDto.name,
            registerRequestDto.contactPerson ?? null,
            registerRequestDto.phoneNumber ?? null,
            registerRequestDto.email ?? null,
            registerRequestDto.rfc ?? null,
            registerRequestDto.notes ?? null,
            registerRequestDto.address? {
                street: registerRequestDto.address.street ?? null,
                externalNumber: registerRequestDto.address.externalNumber ?? null,
                internalNumber: registerRequestDto.address.internalNumber ?? null,
                municipality: registerRequestDto.address.municipality,
                neighborhood: registerRequestDto.address.neighborhood ?? null,
                city: registerRequestDto.address.city,
                state: registerRequestDto.address.state,
                postalCode: registerRequestDto.address.postalCode,
                country: registerRequestDto.address.country,
                reference: registerRequestDto.address.reference ?? null,
            }: null,
        );
          // ...removed commented console.log...
    
          // 2. Ejecutar el Caso de Uso (que contiene la orquestación de la lógica de negocio).
          const suplier = await this.registerSupliersUseCase.execute(registerAppDto);
            
          // 3. Mapear la entidad de dominio resultante a un DTO de respuesta para la API.
          return SuplierMapper.toResponseDto(suplier);
        } catch (error) {
          
          // *** TRADUCCIÓN DE EXCEPCIONES DE DOMINIO A EXCEPCIONES HTTP DE NESTJS ***
          if ((error instanceof InvalidSuplierException) || (error instanceof InvalidAddressException) ) {
            throw new BadRequestException(error.message); // Mapea InvalidNameException a 400 Bad Request
          }
          if(error instanceof SuplierAlreadyExistsException){
            throw new ConflictException(error.message);
          }
          if(error instanceof SuplierNotFoundException){
            throw new NotFoundException(error.message);
          }
    
          // Otros tipos de errores de dominio si existieran
          // if (error instanceof AnotherDomainException) { /* ... */ }
          // Si es un error desconocido o no esperado, relanzarlo o lanzar un InternalServerErrorException
          throw error; // Deja que el filtro global de excepciones lo maneje como 500
        }
      }
}