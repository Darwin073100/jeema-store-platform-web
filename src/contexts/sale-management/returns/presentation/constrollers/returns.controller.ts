import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post } from "@nestjs/common";
import { ReturnsProductsUseCase } from "../../application/use-cases/returns-products.use-case";
import { ReturnsProductsRequestDTO } from "../dtos/returns-products-request.dto";
import { ReturnsProductsDTO } from "../../application/dtos/returns-products.dto";
import { ReturnsAppMapper } from "../../application/mappers/returns-app.mapper";
import { FindReturnsByBranchOfficeUseCase } from "../../application/use-cases/find-returns-by-branch-office.use-cases";

@Controller('returns')
export class ReturnsController {
    constructor(
        private readonly returnsProductUseCase: ReturnsProductsUseCase,
        private readonly findReturnsByBranchOfficeUseCase: FindReturnsByBranchOfficeUseCase
    ){}

    @Post('all')
    @HttpCode(HttpStatus.CREATED)
    async returnsProducts(@Body() dto: ReturnsProductsRequestDTO){
        try {
            const convertDTO:ReturnsProductsDTO = {
                branchOfficeId: dto.branchOfficeId,
                cashSessionId: dto.cashSessionId,
                employeeId: dto.employeeId,
                saleId: dto.saleId,
                products: dto.products.map(item => ({
                    notes: item.notes ?? null,
                    amountReturn: item.amountReturn,
                    inventoryId: item.inventoryId,
                    quantityReturn: item.quantityReturn,
                    saleDetailId: item.saleDetailId
                })),
            };
            const result = await this.returnsProductUseCase.execute(convertDTO);
            return result.map(item=> ReturnsAppMapper.toResponse(item));
        } catch (error) {
            throw error;
        }
    }
    @Get('all/branch-offices/:branchOfficeId')
    @HttpCode(HttpStatus.OK)
    async findReturnsByBranchOffice(@Param('branchOfficeId') branchOfficeId: string){
        const result = await this.findReturnsByBranchOfficeUseCase.execute(BigInt(branchOfficeId));
        return {
            returns: result.map(item => ReturnsAppMapper.toResponse(item))
        };
    }
    
}