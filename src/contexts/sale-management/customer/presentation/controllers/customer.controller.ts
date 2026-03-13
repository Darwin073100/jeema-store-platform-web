import { BadRequestException, Body, ConflictException, Controller, Get, HttpCode, HttpStatus, NotFoundException, Param, ParseIntPipe, Post } from "@nestjs/common";
import { RegisterCustomerUseCase } from "../../application/use-cases/register-customer.use-case";
import { RegisterCustomerRequestDto } from "../dtos/register-customer-request.dto";
import { CustomerResponseDto } from "../../application/dtos/customer-response.dto";
import { RegisterCustomerDto } from "../../application/dtos/register-customer.dto";
import { InvalidCustomerException } from "../../domain/exceptions/invalid-customer.exception";
import { InvalidAddressException } from "../../../../../shared/domain/exceptions/invalid-address.exception";import { CustomerAlreadyExistsException } from "../../domain/exceptions/customer-already-exists.exception";
import { CustomerMapper } from "../../application/mappers/customer.mapper";
import { FindAllCustomerByEstablishmentUseCase } from "../../application/use-cases/find-all-customer-by-establishment.use-case";
import { FindOneCustomerByEstablishmentUseCase } from "../../application/use-cases/find-one-customer-by-establishment.use-case";
import { CustomerNotFountException } from "../../domain/exceptions/customer-not-found.exception";


@Controller('customers')
export class CustomerController{
    constructor(
        private readonly registerCustomerUseCase: RegisterCustomerUseCase,
        private readonly findAllCustomerByEstablishmentUseCase: FindAllCustomerByEstablishmentUseCase,
        private readonly findOneCustomerByEstablishmentUseCase: FindOneCustomerByEstablishmentUseCase,
    ){}

    @Get('all/establishments/:establishmentId')
    @HttpCode(HttpStatus.OK)
    async findAllCustomerByEstablishment(@Param('establishmentId', ParseIntPipe) establishmentId: bigint){
      try {
        const result = await this.findAllCustomerByEstablishmentUseCase.execute(establishmentId);
        return {
          customers: result.map(item => CustomerMapper.toResponseDto(item))
        };
      } catch (error) {
        throw error;
      }
    }

    @Get(':customerId/establishments/:establishmentId')
    @HttpCode(HttpStatus.OK)
    async findOneCustomerByEstablishment(
      @Param('customerId', ParseIntPipe) customerId: bigint, 
      @Param('establishmentId', ParseIntPipe) establishmentId: bigint){
      try {
        const result = await this.findOneCustomerByEstablishmentUseCase.execute(customerId, establishmentId);
        return CustomerMapper.toResponseDto(result);
      } catch (error) {
        if(error instanceof CustomerNotFountException){
          throw new NotFoundException(error.message);
        }
        throw error;
      }
    }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    async registerSuplier(
        @Body() registerRequestDto: RegisterCustomerRequestDto, // Usamos un DTO de Request para validación
      ): Promise<CustomerResponseDto> {
        try {
          // 1. Convertir el DTO de Request (validado por la capa de presentación)
          // al DTO de la capa de Aplicación.
          const registerAppDto = new RegisterCustomerDto(
            registerRequestDto.firstName,
            registerRequestDto.saleDefault,
            registerRequestDto.establishmentId,
            registerRequestDto.lastName,
            registerRequestDto.companyName,
            registerRequestDto.phoneNumber,
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
            }: undefined,
            registerRequestDto.rfc,
            registerRequestDto.email,
            registerRequestDto.customerType
        );
          // ...removed commented console.log...
    
          // 2. Ejecutar el Caso de Uso (que contiene la orquestación de la lógica de negocio).
          const customer = await this.registerCustomerUseCase.execute(registerAppDto);

          // 3. Mapear la entidad de dominio resultante a un DTO de respuesta para la API.
          return CustomerMapper.toResponseDto(customer);
        } catch (error) {
          
          // *** TRADUCCIÓN DE EXCEPCIONES DE DOMINIO A EXCEPCIONES HTTP DE NESTJS ***
          if ((error instanceof InvalidCustomerException) || (error instanceof InvalidAddressException) ) {
            throw new BadRequestException(error.message); // Mapea InvalidNameException a 400 Bad Request
          }

          if(error instanceof CustomerAlreadyExistsException){
            throw new ConflictException(error.message);
          }
    
          // Otros tipos de errores de dominio si existieran
          // if (error instanceof AnotherDomainException) { /* ... */ }
          // Si es un error desconocido o no esperado, relanzarlo o lanzar un InternalServerErrorException
          throw error; // Deja que el filtro global de excepciones lo maneje como 500
        }
      }
}