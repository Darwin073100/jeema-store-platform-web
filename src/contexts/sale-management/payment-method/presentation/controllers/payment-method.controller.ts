import { BadRequestException, Body, ConflictException, Controller, Delete, Get, HttpCode, HttpStatus, NotFoundException, Param, ParseIntPipe, Patch, Post } from "@nestjs/common";
import { RegisterPaymentMethodUseCase } from "../../application/use-cases/register-payment-method.use-case";
import { RegisterPaymentMethodDto } from "../../application/dtos/register-payment-method.dto";
import { RegisterPaymentMethodRequestDto } from "../dtos/register-payment-method-request.dto";
import { PaymentMethodMapper } from "../../application/mappers/payment-method-mapper";
import { PaymentMethodInvalidException } from "../../domain/exceptions/payment-method-invalid.exception";
import { PaymentMethodAlreadyExistsException } from "../../domain/exceptions/payment-method-already-exists.exception";
import { ViewAllPaymentMethodUseCase } from "../../application/use-cases/view-all-payment-method.use-case";
import { UpdatedPaymentMethodUseCase } from "../../application/use-cases/updated-payment-method.use-case";
import { UpdatePaymentMethodRequestDto } from "../dtos/update-payment-method-request.dto";
import { PaymentMethodNotFoundException } from "../../domain/exceptions/payment-method-not-found.exception";
import { DeletePaymentMethodUseCase } from "../../application/use-cases/delete-payment-method.use-case";

@Controller('payment-methods')
export class PaymentMethodController{
    constructor(
        private readonly registerPaymentMethodUseCase: RegisterPaymentMethodUseCase,
        private readonly viewAllPaymentMethodsUseCase: ViewAllPaymentMethodUseCase,
        private readonly updatePaymentMethodUseCase: UpdatedPaymentMethodUseCase,
        private readonly deletePaymentMethodUseCase: DeletePaymentMethodUseCase
    ){}

    @Post()
    @HttpCode(HttpStatus.CREATED) // Código de estado HTTP 201 para creación exitosa
    async registerPaymentMethod(
        @Body()
        httpDto: RegisterPaymentMethodRequestDto
    ){
        try {
            const registerAppDto = new RegisterPaymentMethodDto(
                httpDto.name, 
                httpDto.requiresReference
            );

            const paymentMethod = await this.registerPaymentMethodUseCase.execute(registerAppDto);
            return PaymentMethodMapper.toResponseDto(paymentMethod);
        } catch (error) {
            // *** TRADUCCIÓN DE EXCEPCIONES DE DOMINIO A EXCEPCIONES HTTP DE NESTJS ***
      if (error instanceof PaymentMethodInvalidException) {
        throw new BadRequestException(error.message); // Mapea InvalidNameException a 400 Bad Request
      }

      if( error instanceof PaymentMethodAlreadyExistsException){
        throw new ConflictException(error.message);
      }
      // Si es un error desconocido o no esperado, relanzarlo o lanzar un InternalServerErrorException
      throw error; // Deja que el filtro global de excepciones lo maneje como 500
        }
    }

    @Get()
    @HttpCode(HttpStatus.OK)
    async viewAllPaymentMethods(){
        try {
            const result = await this.viewAllPaymentMethodsUseCase.execute();
            return {
                paymentMethods: result.map(item => PaymentMethodMapper.toResponseDto(item))
            }
        } catch (error) {
            throw error;
        }
    }

    @Patch()
    async updatePaymentMethods(
        @Body() httpDto: UpdatePaymentMethodRequestDto
    ) {
        try {
            const updatedPaymentMethod = await this.updatePaymentMethodUseCase.execute(httpDto);
            return PaymentMethodMapper.toResponseDto(updatedPaymentMethod);
        } catch (error) {
            if( error instanceof PaymentMethodNotFoundException){
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
            await this.deletePaymentMethodUseCase.execute(id);
        } catch (error) {
            if (error instanceof PaymentMethodNotFoundException) {
                throw new NotFoundException(error.message);
            }
            throw error;
        }
    }
}