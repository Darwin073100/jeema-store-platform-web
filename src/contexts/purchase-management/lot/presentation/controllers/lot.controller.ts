import { BadRequestException, Body, ConflictException, Controller, Delete, Get, HttpCode, HttpStatus, NotFoundException, Param, ParseIntPipe, Patch, Post } from "@nestjs/common";
import { RegisterLotRequestDto } from "../dtos/register-lot-request.dto";
import { RegisterLotUseCase } from "../../application/use-case/register-lot.use-case";
import { LotMapper } from "../../application/mappers/lot.mapper";
import { LotAlreadyExistsException } from "../../domain/exceptions/lot-already-exists.exception";
import { LotValidateException } from "../../domain/exceptions/lot-validate.exception";
import { ProductNotFoundException } from "src/contexts/product-management/product/domain/exceptions/product-not-found.exception";
import { UpdateLotRequestDto } from "../dtos/update-lot-request.dto";
import { UpdateLotUseCase } from "../../application/use-case/update-lot.use-case";
import { UpdateLotUnitPurchaseUseCase } from "../../application/use-case/update-lot-unit-purchase.use-case";
import { UpdateLotUnitPurchaseRequestDTO } from "../dtos/update-lot-unit-purchase-request.dto";
import { LotUnitPurchaseMapper } from "../../application/mappers/lot-unit-purchase.mapper";
import { LotNotFoundException } from "../../domain/exceptions/lot-not-found.exception";
import { RegisterLotUnitPurchaseRequestDTO } from "../dtos/register-lot-unit-purchase-request.dto";
import { RegisterLotUnitPurchaseUseCase } from "../../application/use-case/register-lot-unit-purchase.use-case";
import { DeleteLotUseCase } from "../../application/use-case/delete-lot.use-case";
import { DeleteLotUnitPurchaseUseCase } from "../../application/use-case/delete-lot-unit-purchase.use-case";
import { FindReportLotsUseCase } from "../../application/use-case/find-report-lots.use-case";
import { ParseBigIntPipe } from "src/shared/pipes/parse-bigint.pipe";
import { FindReportLotsRequestDTO } from "../dtos/find-report-lots-request.dto";

@Controller('/lots')
export class LotController {

    constructor(
        private readonly registerLotUseCase: RegisterLotUseCase,
        private readonly updateLotUseCase: UpdateLotUseCase,
        private readonly updateLotUnitPurchaseUseCase: UpdateLotUnitPurchaseUseCase,
        private readonly registerLotUnitPurchaseUseCase: RegisterLotUnitPurchaseUseCase,
        private readonly deleteLotUseCase: DeleteLotUseCase,
        private readonly deleteLotUnitPurchaseUseCase: DeleteLotUnitPurchaseUseCase,
        private readonly findReportLotsUseCase: FindReportLotsUseCase
    ){}

    @Post()
    @HttpCode(HttpStatus.CREATED)
    async register(@Body() body: RegisterLotRequestDto) {
        // Adaptar el DTO de request al DTO de aplicación
        try {
            const result = await this.registerLotUseCase.execute({
                initialQuantity: body.initialQuantity,
                suplierId: body.suplierId ?? null,
                purchaseUnit: body.purchaseUnit,
                lotNumber: body.lotNumber,
                productId: body.productId,
                purchasePrice: body.purchasePrice,
                receivedDate: body.receivedDate,
                expirationDate: body.expirationDate ?? null,
                manufacturingDate: body.manufacturingDate ?? null,
                lotUnitPurchases: body.lotUnitPurchases?.map(item => {
                    return {
                        // No pasar lotId aquí, se establecerá automáticamente por la relación
                        purchasePrice: item.purchasePrice,
                        purchaseQuantity: item.purchaseQuantity,
                        unit: item.unit,
                        unitsInPurchaseUnit: item.unitsInPurchaseUnit
                    };
                }) || null,
            });
            
            return LotMapper.toResponseDto(result);
        } catch (error) {
            if (error instanceof LotAlreadyExistsException) {
                throw new ConflictException(error.message);
            }

            if (error instanceof LotValidateException) {
                throw new BadRequestException(error.message);
            }

            if (error instanceof ProductNotFoundException) {
                throw new NotFoundException(error.message);
            }

            throw error;
        }
    }

    @Patch()
    @HttpCode(HttpStatus.OK)
    async update(@Body() body: UpdateLotRequestDto) {
        // Adaptar el DTO de request al DTO de aplicación
        try {
            const result = await this.updateLotUseCase.execute({
                lotId: body.lotId,
                suplierId: body.suplierId ?? null,
                initialQuantity: body.initialQuantity,
                purchaseUnit: body.purchaseUnit,
                lotNumber: body.lotNumber,
                productId: body.productId,
                purchasePrice: body.purchasePrice,
                receivedDate: body.receivedDate,
                expirationDate: body.expirationDate ?? null,
                manufacturingDate: body.manufacturingDate ?? null
            });
            
            return LotMapper.toResponseDto(result);

        } catch (error) {
            if (error instanceof LotAlreadyExistsException) {
                throw new ConflictException(error.message);
            }

            if (error instanceof LotValidateException) {
                throw new BadRequestException(error.message);
            }

            if (error instanceof ProductNotFoundException) {
                throw new NotFoundException(error.message);
            }

            throw error;
        }
    }
    @Patch(':lotId/unit-purchases')
    @HttpCode(HttpStatus.OK)
    async updateLotUnitPurchase(
        @Body() body: UpdateLotUnitPurchaseRequestDTO, 
        @Param('lotId', ParseIntPipe) lotId: number) {

        // Adaptar el DTO de request al DTO de aplicación
        try {
            const result = await this.updateLotUnitPurchaseUseCase.execute({
                lotUnitPurchaseId: body.lotUnitPurchaseId,
                lotId: BigInt(lotId),
                purchasePrice: body.purchasePrice,
                purchaseQuantity: body.purchaseQuantity,
                unit: body.unit,
                unitsInPurchaseUnit: body.unitsInPurchaseUnit
            });
            
            return LotUnitPurchaseMapper.toResponseDTO(result);

        } catch (error) {
            if (error instanceof LotAlreadyExistsException) {
                throw new ConflictException(error.message);
            }

            if (error instanceof LotValidateException) {
                throw new BadRequestException(error.message);
            }

            if (error instanceof LotNotFoundException) {
                throw new NotFoundException(error.message);
            }

            throw error;
        }
    }
    @Post(':lotId/unit-purchases')
    @HttpCode(HttpStatus.CREATED)
    async registerLotUnitPurchase(
        @Body() body: RegisterLotUnitPurchaseRequestDTO, 
        @Param('lotId', ParseIntPipe) lotId: number) {
        // Adaptar el DTO de request al DTO de aplicación
        try {
            const result = await this.registerLotUnitPurchaseUseCase.execute({
                lotId: BigInt(lotId),
                purchasePrice: body.purchasePrice,
                purchaseQuantity: body.purchaseQuantity,
                unit: body.unit,
                unitsInPurchaseUnit: body.unitsInPurchaseUnit
            });
            
            return LotUnitPurchaseMapper.toResponseDTO(result);

        } catch (error) {
            if (error instanceof LotAlreadyExistsException) {
                throw new ConflictException(error.message);
            }

            if (error instanceof LotValidateException) {
                throw new BadRequestException(error.message);
            }

            if (error instanceof LotNotFoundException) {
                throw new NotFoundException(error.message);
            }

            throw error;
        }
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    async delete(@Param('id', ParseIntPipe) lotId: bigint){
        try {
            await this.deleteLotUseCase.execute(lotId);
            Promise.resolve();
        } catch (error) {
             if (error instanceof LotAlreadyExistsException) {
                throw new ConflictException(error.message);
            }

            if (error instanceof LotValidateException) {
                throw new BadRequestException(error.message);
            }

            if (error instanceof LotNotFoundException) {
                throw new NotFoundException(error.message);
            }

            throw error;
        }
    } 
    @Post('reports/branch-offices/:id')
    @HttpCode(HttpStatus.OK)
    async findReportLots(@Param('id', ParseBigIntPipe) id: bigint, @Body() dto: FindReportLotsRequestDTO){
        try {
            const result = await this.findReportLotsUseCase.execute(id, dto);
            return {
                lots: result.map(item => LotMapper.toResponseDto(item))
            };
        } catch (error) {
            throw error;
        }
    } 

    @Delete(':lotId/unit-purchases/:lotUnitPurchaseId')
    @HttpCode(HttpStatus.NO_CONTENT)
    async deleteUnitLotPurchase(
        @Param('lotId', ParseIntPipe) lotId: bigint,
        @Param('lotUnitPurchaseId', ParseIntPipe) lotUnitPurchaseId: bigint,
    ){
        try {
            await this.deleteLotUnitPurchaseUseCase.execute(lotId, lotUnitPurchaseId);
            Promise.resolve();
        } catch (error) {
             if (error instanceof LotAlreadyExistsException) {
                throw new ConflictException(error.message);
            }

            if (error instanceof LotValidateException) {
                throw new BadRequestException(error.message);
            }

            if (error instanceof LotNotFoundException) {
                throw new NotFoundException(error.message);
            }

            throw error;
        }
    } 
}