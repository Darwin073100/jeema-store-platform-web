import { BadRequestException, Body, ConflictException, Controller, Delete, Get, HttpCode, HttpStatus, NotFoundException, Param, ParseIntPipe, Patch, Post } from "@nestjs/common";
import { RegisterCategoryUseCase } from "../../application/use-cases/register-category.use-case";
import { RegisterCategoryDto } from "../../application/dtos/register-category.dto";
import { RegisterCategoryRequestDto } from "../dtos/register-category-request.dto";
import { CategoryMapper } from "../../application/mappers/category-mapper";
import { InvalidCategoryException } from "../../domain/exceptions/invalid-category.exception";
import { CategoryAlreadyExistsException } from "../../domain/exceptions/category-already-exists.exception";
import { ViewAllCategoriesUseCase } from "../../application/use-cases/view-all-categories.use-case";
import { UpdatedCategoryUseCase } from "../../application/use-cases/updated-category.use-case";
import { UpdateCategoryRequestDto } from "../dtos/update-category-request.dto";
import { CategoryNotFoundException } from "../../domain/exceptions/category-not-found.exception";
import { DeleteCategoryUseCase } from "../../application/use-cases/delete-category.use-case";
import { FindAllCategoriesByEstablishmentUseCase } from "../../application/use-cases/find-all-categories-by-establishment.use-case";

@Controller('categories')
export class CategoryController{
    constructor(
        private readonly registerCategoryUseCase: RegisterCategoryUseCase,
        private readonly viewAllCategoriesUseCase: ViewAllCategoriesUseCase,
        private readonly updateCategoryUseCase: UpdatedCategoryUseCase,
        private readonly deleteCategoryUseCase: DeleteCategoryUseCase,
        private readonly findAllCategoriesByEstablishmentUseCase: FindAllCategoriesByEstablishmentUseCase,
    ){}

    @Post()
    @HttpCode(HttpStatus.CREATED) // Código de estado HTTP 201 para creación exitosa
    async registerCategory(
        @Body()
        registerRequestDto: RegisterCategoryRequestDto
    ){
        try {
            const registerAppDto = new RegisterCategoryDto(
                registerRequestDto.establishmentId,
                registerRequestDto.name, 
                registerRequestDto.description ?? null
            );

            const category = await this.registerCategoryUseCase.execute(registerAppDto);
            return CategoryMapper.toResponseDto(category);
        } catch (error) {
            // *** TRADUCCIÓN DE EXCEPCIONES DE DOMINIO A EXCEPCIONES HTTP DE NESTJS ***
      if (error instanceof InvalidCategoryException) {
        throw new BadRequestException(error.message); // Mapea InvalidNameException a 400 Bad Request
      }

      if( error instanceof CategoryAlreadyExistsException){
        throw new ConflictException(error.message);
      }
      // Si es un error desconocido o no esperado, relanzarlo o lanzar un InternalServerErrorException
      throw error; // Deja que el filtro global de excepciones lo maneje como 500
        }
    }

    @Get()
    @HttpCode(HttpStatus.OK)
    async viewAllCategories(){
        try {
            const result = await this.viewAllCategoriesUseCase.execute();
            return {
                categories: result.map(item => CategoryMapper.toResponseDto(item))
            }
        } catch (error) {
            throw error;
        }
    }
    @Get('establishments/:establishmentId')
    @HttpCode(HttpStatus.OK)
    async findAllCategoriesByEstablishment(@Param('establishmentId') establishmentId: string){
        try {
            const result = await this.findAllCategoriesByEstablishmentUseCase.execute(BigInt(establishmentId));
            return {
                categories: result.map(item => CategoryMapper.toResponseDto(item))
            }
        } catch (error) {
            throw error;
        }
    }

    @Patch()
    async updateCategory(
        @Body() updateCategoryRequestDto: UpdateCategoryRequestDto
    ) {
        try {
            const updatedCategory = await this.updateCategoryUseCase.execute(updateCategoryRequestDto);
            return CategoryMapper.toResponseDto(updatedCategory);
        } catch (error) {
            if( error instanceof CategoryNotFoundException){
                throw new NotFoundException(error.message);
            }
            // Manejo de errores
            throw error;
        }
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    async deleteCategory(
        @Param('id', ParseIntPipe) id: bigint
    ) {
        try {
            await this.deleteCategoryUseCase.execute(id);
        } catch (error) {
            if (error instanceof CategoryNotFoundException) {
                throw new NotFoundException(error.message);
            }
            throw error;
        }
    }
}