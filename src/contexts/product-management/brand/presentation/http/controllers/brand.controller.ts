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
  Patch,
  Delete,
} from '@nestjs/common';
import { RegisterBrandUseCase } from '../../../application/use-cases/register-brand.use-case';
import { FindBrandByIdUseCase } from '../../../application/use-cases/find-brand-by-id.use-case';
import { RegisterBrandDto } from '../../../application/dtos/register-brand.dto'; // DTO de entrada de la aplicación
import { BrandResponseDto } from '../../../application/dtos/brand-response.dto'; // DTO de salida de la aplicación
import { BrandMapper } from '../../../application/mappers/brand.mapper';
import { RegisterBrandRequestDto } from '../dtos/register-brand-request.dto';
import { ParamIdDto } from 'src/shared/presentation/http/dtos/param-id.dto';
import { InvalidBrandException } from '../../../domain/exceptions/invalid-brand.exception';
import { BrandAlreadyExistsException } from '../../../domain/exceptions/brand-already-exists.exception';
import { ViewAllBrandsUseCase } from '../../../application/use-cases/view-all-brands.use-case';
import { UpdateBrandRequestDto } from '../dtos/update-brand-request.dto';
import { UpdateBrandDto } from '../../../application/dtos/update-brand.dto';
import { UpdateBrandUseCase } from '../../../application/use-cases/update-brand.use-case';
import { DeleteBrandUseCase } from '../../../application/use-cases/delete-brand.use-case';
import { BrandNotFoundException } from '../../../domain/exceptions/brand-not-found.exception';
import { FindAllBrandByEstablishmentUseCase } from '../../../application/use-cases/find-all-brand-by-establishment.use-case';

@Controller('brands') // Ruta base para este controlador
export class BrandController {
  constructor(
    // Inyectamos los Casos de Uso. El controlador no tiene lógica de negocio.
    private readonly registerBrandUseCase: RegisterBrandUseCase,
    private readonly findBrandByIdUseCase: FindBrandByIdUseCase,
    private readonly viewAllBrandsUseCase: ViewAllBrandsUseCase,
    private readonly updateBrandUseCase: UpdateBrandUseCase,
    private readonly deleteBrandUseCase: DeleteBrandUseCase,
    private readonly findAllBrandsByEstablishmentUseCase: FindAllBrandByEstablishmentUseCase,
  ) {}

  /**
   * Endpoint para registrar un nuevo establecimiento.
   *
   * @param registerDto Los datos del establecimiento a registrar.
   * @returns El DTO de respuesta del establecimiento creado.
   */
  @Post()
  @HttpCode(HttpStatus.CREATED) // Código de estado HTTP 201 para creación exitosa
  async registerEstablishment(
    @Body() registerRequestDto: RegisterBrandRequestDto, // Usamos un DTO de Request para validación
  ): Promise<BrandResponseDto> {
    try {
      const registerAppDto = new RegisterBrandDto(registerRequestDto.establishmentId, registerRequestDto.name);
      const brand = await this.registerBrandUseCase.execute(registerAppDto);
      return BrandMapper.toResponseDto(brand);
    } catch (error) {
      // *** TRADUCCIÓN DE EXCEPCIONES DE DOMINIO A EXCEPCIONES HTTP DE NESTJS ***
      if (error instanceof InvalidBrandException) {
        throw new BadRequestException(error.message); // Mapea InvalidNameException a 400 Bad Request
      }

      if(error instanceof BrandAlreadyExistsException){
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
  async findEstablishmentById(
    @Param() params: ParamIdDto,
  ): Promise<BrandResponseDto> {
    try {
    const centerId = BigInt(params.id); // Convertimos el string a BigInt para el dominio
    const establishment =
      await this.findBrandByIdUseCase.execute(centerId);

    if (!establishment) {
      // Lanzar una excepción de NestJS que se mapee a un 404
      throw new NotFoundException('Marca no encontrada.'); // O una excepción personalizada de NestJS
    }

    // 3. Mapear la entidad de dominio a un DTO de respuesta.
    return BrandMapper.toResponseDto(establishment);
    } catch (error) {
      throw error; // Deja que el filtro global de excepciones lo maneje
    }
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async viewAllBrands(){
    try {
      const result = await this.viewAllBrandsUseCase.execute();
      const brandlistResponse = result.map(item => BrandMapper.toResponseDto(item));
      return {
        brands: brandlistResponse
      }
    } catch (error) {
      throw error;
    }
  }
  @Get('establishments/:establishmentId')
  @HttpCode(HttpStatus.OK)
  async findAllBrandByEstablishment( @Param('establishmentId') establishmentId: string ){
    try {
      const result = await this.findAllBrandsByEstablishmentUseCase.execute(BigInt(establishmentId));
      const brandlistResponse = result.map(item => BrandMapper.toResponseDto(item));
      return {
        brands: brandlistResponse
      }
    } catch (error) {
      throw error;
    }
  }

  // Actualizar una marca
  @Patch()
  @HttpCode(HttpStatus.OK)
  async updateBrand(
    @Body() updateRequestDto: UpdateBrandRequestDto,
  ): Promise<BrandResponseDto> {
    try {
      const brandId = BigInt(updateRequestDto.brandId);
      const updateAppDto = new UpdateBrandDto(brandId, updateRequestDto.name);

      const brand = await this.updateBrandUseCase.execute(updateAppDto);
      return BrandMapper.toResponseDto(brand);
    } catch (error) {
      if(error instanceof BrandNotFoundException) {
        throw new NotFoundException(error.message);

      }
      throw error;
    }
  }

  // Eliminar una marca
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteBrand(
    @Param() params: ParamIdDto,
  ): Promise<void> {
    try {
      const brandId = BigInt(params.id);
      await this.deleteBrandUseCase.execute(brandId);
    } catch (error) {
      throw error;
    }
  }
}
