import { BadRequestException, Body, ConflictException, Controller, Delete, Get, HttpCode, HttpStatus, NotFoundException, Param, ParseIntPipe, Patch, Post } from "@nestjs/common";
import { RegisterSaleUseCase } from "../../application/use-cases/register-sale.use-case";
import { RegisterSaleDto } from "../../application/dtos/register-sale.dto";
import { RegisterSaleRequestDto } from "../dtos/register-sale-request.dto";
import { SaleMapper } from "../../application/mappers/sale-mapper";
import { SaleInvalidException } from "../../domain/exceptions/sale-invalid.exception";
import { SaleAlreadyExistsException } from "../../domain/exceptions/sale-already-exists.exception";
import { ViewAllSaleUseCase } from "../../application/use-cases/view-all-sale.use-case";
import { SaleNotFoundException } from "../../domain/exceptions/sale-not-found.exception";
import { DeletePaymentMethodUseCase } from "../../application/use-cases/delete-payment-method.use-case";
import { RegisterSaleDetailRequestDto } from "src/contexts/sale-management/sale-detail/presentation/dtos/register-sale-detail.request.dto";
import { SaleDetailRegisterDto } from "src/contexts/sale-management/sale-detail/application/dtos/sale-detail-register.dto";
import { RegisterSaleDetailUseCase } from "src/contexts/sale-management/sale-detail/application/use-case/register-sale-detail.use-case";
import { ForSaleEnum } from "src/shared/domain/enums/for-sale.enum";
import { SaleDetailAppMapper } from "src/contexts/sale-management/sale-detail/application/mappers/sale-detail.app-mapper";
import { FindByIdSaleUseCase } from "../../application/use-cases/find-by-id-sale.use-case";
import { InventoryInsufficientStockException } from "src/contexts/sale-management/sale-detail/domain/exceptions/inventory-insufficient-stock.exception";
import { RegisterSalePaymentUseCase } from "src/contexts/sale-management/sale-payment/application/use-cases/register-sale-payment.use-case";
import { RegisterSalePaymentDTO } from "src/contexts/sale-management/sale-payment/application/dtos/register-sale-payment.dto";
import { RegisterSalePaymentRequestDto } from "src/contexts/sale-management/sale-payment/presentation/dtos/register-sale-payment-request.dto";
import { SalePaymentMapper } from "src/contexts/sale-management/sale-payment/application/mappers/sale-payment.mapper";
import { SalePaymentNotFoundException } from "src/contexts/sale-management/sale-payment/domain/exceptions/sale-payment-not-found.exception";
import { SalePaymentConflictException } from "src/contexts/sale-management/sale-payment/domain/exceptions/sale-payment-conflict.exception";
import { PhysicalDeleteSaleDetailUseCase } from "src/contexts/sale-management/sale-detail/application/use-case/physical-delete-sale-detail.use-case";
import { ModifyQuantitySaleDetailUseCase } from "src/contexts/sale-management/sale-detail/application/use-case/modify-quantity-sale-detail.use-case";
import { ModifyQuantitySaleDetailRequestDto } from "src/contexts/sale-management/sale-detail/presentation/dtos/modify-quantity-sale-detail.request.dto";
import { CalculateSaleRequestDto } from "../dtos/calculate-sale-request.dto";
import { CalculateSaleDTO } from "../../application/dtos/calculate-sale.dto";
import { CalculateSaleUseCase } from "../../application/use-cases/calculate-sale.use-case";
import { FindAllByBranchOfficeSaleUseCase } from "../../application/use-cases/find-all-by-branch-office-sale.use-case";
import { FindFinishSaleByIdUseCase } from "../../application/use-cases/find-finish-sale-by-id.use-case";
import { SaleConflictException } from "../../domain/exceptions/sale-conflict.exception";

@Controller('sales')
export class SaleController {
    constructor(
        private readonly registerSaleUseCase: RegisterSaleUseCase,
        private readonly viewAllPaymentMethodsUseCase: ViewAllSaleUseCase,
        private readonly deletePaymentMethodUseCase: DeletePaymentMethodUseCase,
        private readonly registerSaleDetailUseCase: RegisterSaleDetailUseCase,
        private readonly findByIdSaleUseCase: FindByIdSaleUseCase,
        private readonly registerSalePaymentUseCase: RegisterSalePaymentUseCase,
        private readonly physicalDeleteSaleDetailUseCase: PhysicalDeleteSaleDetailUseCase,
        private readonly modifyQuantitySaleDetailUseCase: ModifyQuantitySaleDetailUseCase,
        private readonly finalizeSaleUseCase: CalculateSaleUseCase,
        private readonly findAllByBranchOfficeSaleUseCase: FindAllByBranchOfficeSaleUseCase,
        private readonly findFinishSaleByIdUseCase: FindFinishSaleByIdUseCase,
    ) { }

    @Post()
    @HttpCode(HttpStatus.CREATED) // Código de estado HTTP 201 para creación exitosa
    async registerSale(
        @Body()
        httpDto: RegisterSaleRequestDto
    ) {
        try {
            const registerAppDto = new RegisterSaleDto(
                httpDto.branchOfficeId,
                httpDto.customerId,
                httpDto.employeeId,
                httpDto.cashRegisterId,
            );

            const sale = await this.registerSaleUseCase.execute(registerAppDto);
            return SaleMapper.toResponseDto(sale);
        } catch (error) {
            // *** TRADUCCIÓN DE EXCEPCIONES DE DOMINIO A EXCEPCIONES HTTP DE NESTJS ***
            if (error instanceof SaleInvalidException) {
                throw new BadRequestException(error.message); // Mapea InvalidNameException a 400 Bad Request
            }

            if (error instanceof SaleAlreadyExistsException) {
                throw new ConflictException(error.message);
            }

            if (error instanceof SaleNotFoundException) {
                throw new NotFoundException(error.message);
            }
            // Si es un error desconocido o no esperado, relanzarlo o lanzar un InternalServerErrorException
            throw error; // Deja que el filtro global de excepciones lo maneje como 500
        }
    }
    /**
     * Este metodo es para el endpoind de la api, elimina un detalle de la venta seleccionada.
     * @param saleId 
     * @param detailId 
     */
    @Patch(':saleId/details/:detailId/quantity')
    @HttpCode(HttpStatus.NO_CONTENT)
    async modifyQuantitySaleDetail(
        @Param('saleId', ParseIntPipe) saleId: bigint,
        @Param('detailId', ParseIntPipe) detailId: bigint,
        @Body() dto: ModifyQuantitySaleDetailRequestDto
    ) {
        try {
            await this.modifyQuantitySaleDetailUseCase.execute(saleId, detailId, dto.quantity);
        } catch (error) {
            if (error instanceof SaleNotFoundException) {
                throw new NotFoundException(error.message);
            }
            throw error;
        }
    }
    @Delete(':saleId/details/:detailId')
    @HttpCode(HttpStatus.NO_CONTENT)
    async physicalDeleteDetail(
        @Param('saleId', ParseIntPipe) saleId: bigint,
        @Param('detailId', ParseIntPipe) detailId: bigint,
    ) {
        try {
            await this.physicalDeleteSaleDetailUseCase.execute(saleId, detailId);
        } catch (error) {
            if (error instanceof SaleNotFoundException) {
                throw new NotFoundException(error.message);
            }
            throw error;
        }
    }
    @Patch(':id/details')
    @HttpCode(HttpStatus.OK) // Código de estado HTTP 201 para creación exitosa
    async registerSaleDetail(
        @Param('id', ParseIntPipe) saleId: bigint,
        @Body() httpDto: RegisterSaleDetailRequestDto
    ) {
        try {
            const registerAppDto = new SaleDetailRegisterDto(
                saleId,
                httpDto.productBarCodeAtSale,
                httpDto.productUnitAtSale as ForSaleEnum,
                httpDto.quantity,
                httpDto.saleFor,
                httpDto.specialPrice,
                httpDto.notes
            );

            const sale = await this.registerSaleDetailUseCase.execute(registerAppDto);

            if(!sale) throw new NotFoundException('No se pudo registrar el detalle de la venta');

            return SaleDetailAppMapper.toResponseDto(sale);
        } catch (error) {
            // *** TRADUCCIÓN DE EXCEPCIONES DE DOMINIO A EXCEPCIONES HTTP DE NESTJS ***
            if (error instanceof SaleInvalidException) {
                throw new BadRequestException(error.message); // Mapea InvalidNameException a 400 Bad Request
            }

            if (error instanceof InventoryInsufficientStockException) {
                throw new BadRequestException(error.message);
            }

            if (error instanceof SaleNotFoundException) {
                throw new NotFoundException(error.message);
            }
            // Si es un error desconocido o no esperado, relanzarlo o lanzar un InternalServerErrorException
            throw error; // Deja que el filtro global de excepciones lo maneje como 500
        }
    }

    @Patch(':id/finalize')
    @HttpCode(HttpStatus.OK) // Código de estado HTTP 201 para creación exitosa
    async calculateSale(
        @Param('id', ParseIntPipe) saleId: bigint,
        @Body() httpDto: CalculateSaleRequestDto
    ) {
        try {
            let salePayments: RegisterSalePaymentDTO[] = []
            if(httpDto.salePayments){
                salePayments = httpDto.salePayments.map(item => ({
                    amountPaid: item.amountPaid,
                    paymentMethodId: item.paymentMethodId,
                    referenceNumber: item.referenceNumber,
                    saleId,
                }));
            }
            const registerAppDto = new CalculateSaleDTO(
                saleId,
                httpDto.customerId,
                httpDto.employeeId,
                httpDto.cashRegisterId,
                httpDto.inAmount,
                httpDto.status,
                salePayments,
                httpDto.notes ?? null
            );
            
            const sale = await this.finalizeSaleUseCase.execute(registerAppDto);

            if(!sale) throw new NotFoundException('No se pudo finalizar la venta.');

            return SaleMapper.toResponseDto(sale);
        } catch (error) {
            // *** TRADUCCIÓN DE EXCEPCIONES DE DOMINIO A EXCEPCIONES HTTP DE NESTJS ***
            if (error instanceof SaleInvalidException) {
                throw new BadRequestException(error.message); // Mapea InvalidNameException a 400 Bad Request
            }
            if (error instanceof InventoryInsufficientStockException) {
                throw new BadRequestException(error.message);
            }
            if (error instanceof SaleNotFoundException) {
                throw new NotFoundException(error.message);
            }
            if(error instanceof SaleConflictException){
                throw new ConflictException(error.message);
            }
            // Si es un error desconocido o no esperado, relanzarlo o lanzar un InternalServerErrorException
            throw error; // Deja que el filtro global de excepciones lo maneje como 500
        }
    }
    @Patch(':id/paid')
    @HttpCode(HttpStatus.OK) // Código de estado HTTP 201 para creación exitosa
    async paidSale(
        @Param('id', ParseIntPipe) saleId: bigint,
        @Body() httpDto: RegisterSalePaymentRequestDto
    ) {
        try {

            const registerSalePaymentDTOs = httpDto.methods.map((item)=> {
                return new RegisterSalePaymentDTO(
                    item.paymentMethodId,
                    saleId,
                    item.amountPaid,
                    item.referenceNumber
                );
            });
            

            const sale = await this.registerSalePaymentUseCase.execute(registerSalePaymentDTOs);

            if(!sale) throw new NotFoundException('No se pudo registrar el detalle de la venta');

            return {
                payments: sale.map(item => SalePaymentMapper.toResponseDto(item))
            }
        } catch (error) {
            // *** TRADUCCIÓN DE EXCEPCIONES DE DOMINIO A EXCEPCIONES HTTP DE NESTJS ***
            if (error instanceof SaleInvalidException) {
                throw new BadRequestException(error.message); // Mapea InvalidNameException a 400 Bad Request
            }

            if (error instanceof InventoryInsufficientStockException) {
                throw new BadRequestException(error.message);
            }

            if (error instanceof SalePaymentConflictException) {
                throw new ConflictException(error.message);
            }

            if (error instanceof SalePaymentNotFoundException || error instanceof SaleNotFoundException) {
                throw new NotFoundException(error.message);
            }
            // Si es un error desconocido o no esperado, relanzarlo o lanzar un InternalServerErrorException
            throw error; // Deja que el filtro global de excepciones lo maneje como 500
        }
    }
    @Get('all/branchOffices/:id')
    @HttpCode(HttpStatus.OK) // Código de estado HTTP 201 para creación exitosa
    async findAllByIdBranchOffice(
        @Param('id', ParseIntPipe) branchOfficeId: bigint
    ) {
        try {
            const sales = await this.findAllByBranchOfficeSaleUseCase.execute(branchOfficeId);
            return {
                sales: sales.map(sale => SaleMapper.toResponseDto(sale))
            };
        } catch (error) {
            // *** TRADUCCIÓN DE EXCEPCIONES DE DOMINIO A EXCEPCIONES HTTP DE NESTJS ***

            if (error instanceof SaleNotFoundException) {
                throw new NotFoundException(error.message);
            }
            // Si es un error desconocido o no esperado, relanzarlo o lanzar un InternalServerErrorException
            throw error; // Deja que el filtro global de excepciones lo maneje como 500
        }
    }
    @Get(':id/info')
    @HttpCode(HttpStatus.OK) // Código de estado HTTP 201 para creación exitosa
    async findFinishSaleById(
        @Param('id', ParseIntPipe) saleId: bigint
    ) {
        try {
            const sale = await this.findFinishSaleByIdUseCase.execute(saleId);
            if(!sale){
                throw new SaleNotFoundException('No se encontro la venta con id ' + saleId );
            }
            return SaleMapper.toResponseDto(sale);
        } catch (error) {
            // *** TRADUCCIÓN DE EXCEPCIONES DE DOMINIO A EXCEPCIONES HTTP DE NESTJS ***

            if (error instanceof SaleNotFoundException) {
                throw new NotFoundException(error.message);
            }
            // Si es un error desconocido o no esperado, relanzarlo o lanzar un InternalServerErrorException
            throw error; // Deja que el filtro global de excepciones lo maneje como 500
        }
    }
    @Get(':id/details')
    @HttpCode(HttpStatus.OK) // Código de estado HTTP 201 para creación exitosa
    async findByIdSaleWithDetail(
        @Param('id', ParseIntPipe) saleId: bigint
    ) {
        try {
            const sale = await this.findByIdSaleUseCase.execute(saleId);
            if(!sale){
                throw new SaleNotFoundException('No se encontro la venta con id ' + saleId );
            }
            return SaleMapper.toResponseDto(sale);
        } catch (error) {
            // *** TRADUCCIÓN DE EXCEPCIONES DE DOMINIO A EXCEPCIONES HTTP DE NESTJS ***

            if (error instanceof SaleNotFoundException) {
                throw new NotFoundException(error.message);
            }
            // Si es un error desconocido o no esperado, relanzarlo o lanzar un InternalServerErrorException
            throw error; // Deja que el filtro global de excepciones lo maneje como 500
        }
    }
    @Get()
    @HttpCode(HttpStatus.OK)
    async viewAllPaymentMethods() {
        try {
            const result = await this.viewAllPaymentMethodsUseCase.execute();
            return {
                paymentMethods: result.map(item => SaleMapper.toResponseDto(item))
            }
        } catch (error) {
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
            if (error instanceof SaleNotFoundException) {
                throw new NotFoundException(error.message);
            }
            throw error;
        }
    }



    
}