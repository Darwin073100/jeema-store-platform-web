import { BadRequestException, Body, Controller, Delete, Get, HttpCode, HttpStatus, NotFoundException, Param, ParseIntPipe, Patch, Post, Query } from "@nestjs/common";
import { RegisterInventoryUseCase } from "../../application/use-case/register-inventory.use-case";
import { InventoryRequestDTO } from "../dtos/inventory-request.dto";
import { InventoryNotFoundException } from "../../domain/exceptions/inventory-not-found.exception";
import { InvalidInventoryException } from "../../domain/exceptions/invalid-inventory.exception";
import { InventoryMapper } from "../../application/mapper/inventory.mapper";
import { ViewAllInventoryUseCase } from "../../application/use-case/view-all-inventory.use-case";
import { UpdateInventoryRequestDTO } from "../dtos/update-inventory-request.dto";
import { UpdateInventoryUseCase } from "../../application/use-case/update-inventory.use-case";
import { DeleteInventoryUseCase } from "../../application/use-case/delete-inventory.use-case";
import { FindByInternalBarCodeInventoryUseCase } from "../../application/use-case/find-by-internal-barcode-inventory.use-case";
import { FindByLocationItemUseCase } from "src/contexts/inventory-management/inventory-item/application/use-case/find-by-location-item.use-case";
import { InventoryItemMapper } from "src/contexts/inventory-management/inventory-item/application/mapper/inventory-item.mapper";
import { FindByLocationAndBranchOfficeItemUseCase } from "src/contexts/inventory-management/inventory-item/application/use-case/find-by-location-and-branch-office-item.use-case";
import { FindByLocationAndBranchOfficeQueryDTO } from "src/contexts/inventory-management/inventory-item/presentation/dtos/find-by-location-and-branch-office-query.dto";
import { EditInventoryItemUseCase } from "src/contexts/inventory-management/inventory-item/application/use-case/edit-inventory-item.use-case";
import { EditInventoryItemRequestDTO } from "src/contexts/inventory-management/inventory-item/presentation/dtos/edit-inventory-item-request.dto";
import { EditInventoryItemDto } from "src/contexts/inventory-management/inventory-item/application/dtos/edit-inventory-item.dto";
import { AddInventoryItemUseCase } from "src/contexts/inventory-management/inventory-item/application/use-case/add-inventory-item.use-case";
import { EditQuantityInventoryItemRequestDTO } from "src/contexts/inventory-management/inventory-item/presentation/dtos/edit-quantity-inventory-item-request.dto";
import { InventoryItemNotFoundException } from "src/contexts/inventory-management/inventory-item/domain/exceptions/inventory-item-not-found.exception";
import { GenerateBarcodeUseCase } from "../../application/use-case/generate-barcode.use-case";
import { ParseBigIntPipe } from "src/shared/pipes/parse-bigint.pipe";

@Controller('inventories')
export class InventoryController{
    constructor(
        private readonly registerInventoryUseCase: RegisterInventoryUseCase,
        private readonly viewAllInventoryUseCase: ViewAllInventoryUseCase, 
        private readonly updateInventoryUseCase: UpdateInventoryUseCase,
        private readonly deleteInventoryUseCase: DeleteInventoryUseCase,
        private readonly findByInternalBarCodeInventoryUseCase: FindByInternalBarCodeInventoryUseCase,
        private readonly findByLocationItemUseCase: FindByLocationItemUseCase,
        private readonly findByLocationAndBranchOfficeItemUseCase: FindByLocationAndBranchOfficeItemUseCase,
        private readonly editInventoryItemUseCase: EditInventoryItemUseCase,
        private readonly addInventoryItemUseCase: AddInventoryItemUseCase,
        private readonly generateBarcodeUseCase: GenerateBarcodeUseCase,
    ){}

    // Endpoint para registrar un nuevo item de inventario
    @Post()
    @HttpCode(HttpStatus.CREATED)
    async register(@Body() inventoryRequestDto: InventoryRequestDTO) {
        try {
            const result = await this.registerInventoryUseCase.execute({
            productId: inventoryRequestDto.productId,
            branchOfficeId: inventoryRequestDto.branchOfficeId,
            internalBarCode: inventoryRequestDto.internalBarCode,
            salePriceOne: inventoryRequestDto.salePriceOne,
            salePriceMany: inventoryRequestDto.salePriceMany,
            saleQuantityMany: inventoryRequestDto.saleQuantityMany,
            salePriceSpecial: inventoryRequestDto.salePriceSpecial,
            minStockBranch: inventoryRequestDto.minStockBranch,
            maxStockBranch: inventoryRequestDto.maxStockBranch,
            isSellable: inventoryRequestDto.isSellable,
        });
        return InventoryMapper.toResponseDto(result);
        } catch (error) {
            if(error instanceof InvalidInventoryException){
                throw new BadRequestException(error.message);
            }

            if(error instanceof InventoryNotFoundException) {
                throw new NotFoundException(error.message);
            }
            throw error;
        }

    }
    @Patch()
    @HttpCode(HttpStatus.OK)
    async update(@Body() inventoryRequestDto: UpdateInventoryRequestDTO) {
        try {
            const result = await this.updateInventoryUseCase.execute({
                inventoryId: inventoryRequestDto.inventoryId,
                productId: inventoryRequestDto.productId,
                internalBarCode: inventoryRequestDto.internalBarCode,
                branchOfficeId: inventoryRequestDto.branchOfficeId,
                salePriceOne: inventoryRequestDto.salePriceOne,
                salePriceMany: inventoryRequestDto.salePriceMany,
                saleQuantityMany: inventoryRequestDto.saleQuantityMany,
                salePriceSpecial: inventoryRequestDto.salePriceSpecial,
                minStockBranch: inventoryRequestDto.minStockBranch,
                maxStockBranch: inventoryRequestDto.maxStockBranch,
                isSellable: inventoryRequestDto.isSellable,
            });
        return InventoryMapper.toResponseDto(result);
        } catch (error) {
            if(error instanceof InvalidInventoryException){
                throw new BadRequestException(error.message);
            }

            if(error instanceof InventoryNotFoundException) {
                throw new NotFoundException(error.message);
            }
            throw error;
        }
        
    }
    
    @Get()
    @HttpCode(HttpStatus.OK)
    async findByInternalBarcode(@Query('barCode') barCode: string){
        try {
            const result = await this.findByInternalBarCodeInventoryUseCase.execute(barCode);
            if(!result){
                throw new NotFoundException('No se encontró un producto con el codigo de barras ' + barCode);
            }
            return InventoryMapper.toResponseDto(result);
        } catch (error) {
            if(error instanceof InvalidInventoryException){
                throw new BadRequestException(error.message);
            }

            if(error instanceof InventoryNotFoundException) {
                throw new NotFoundException(error.message);
            }
            throw error;
        }
        
    }

    @Get('all/items')
    async findByLocationAndBranchOfficeItem(
        @Query() query: FindByLocationAndBranchOfficeQueryDTO
    ){
        try {
            const result = await this.findByLocationAndBranchOfficeItemUseCase.execute(BigInt(query.branchOfficeId), query.location);
            return {
                items: result.map(item => InventoryItemMapper.toResponseDto(item)),
            };
        } catch (error) {
            if(error instanceof InventoryNotFoundException){
                throw new NotFoundException(error.message);
            }
        }

    }
    @Get('barcode/establishments/:establishmentId/branch-offices/:branchOfficeId')
    async generateBarcode(
        @Param('establishmentId', ParseBigIntPipe) establishmentId: bigint,
        @Param('branchOfficeId', ParseBigIntPipe) branchOfficeId: bigint,
    ){
        try {
            const result = await this.generateBarcodeUseCase.execute(establishmentId,branchOfficeId);
            return {
                barcode: result
            };
        } catch (error) {
            if(error instanceof InventoryNotFoundException){
                throw new NotFoundException(error.message);
            }
        }

    }
    @Get(':inventoryId/items')
    async findByLocationItem(
        @Param('inventoryId') inventoriId: bigint,
        @Query('location') location: string
    ){
        try {
            const result = await this.findByLocationItemUseCase.execute(inventoriId,location);
            return InventoryItemMapper.toResponseDto(result);
        } catch (error) {
            if(error instanceof InventoryNotFoundException){
                throw new NotFoundException(error.message);
            }
        }

    }

    @Patch('add/items/:itemId')
    @HttpCode(HttpStatus.OK)
    async addQuantityItem(
        @Param('itemId', ParseIntPipe) itemId: bigint,
        @Body() command: EditQuantityInventoryItemRequestDTO
    ){
        try {

            const result = await this.addInventoryItemUseCase.execute(itemId, command.quantityOnHand);
            return InventoryItemMapper.toResponseDto(result);
        } catch (error) {
            if(error instanceof InventoryNotFoundException || error instanceof InventoryItemNotFoundException){
                throw new NotFoundException(error.message);
            }
            throw error;
        }
    }
    @Patch(':inventoryId/items/:itemId')
    @HttpCode(HttpStatus.OK)
    async editItem(
        @Param('inventoryId', ParseIntPipe) inventoryId: bigint,
        @Param('itemId', ParseIntPipe) itemId: bigint,
        @Body() command: EditInventoryItemRequestDTO
    ){
        try {
            const dto: EditInventoryItemDto = {
                inventoryId: inventoryId,
                inventoryItemId: itemId,
                location: command.location,
                quantityOnHan: command.quantityOnHand
            }
            const result = await this.editInventoryItemUseCase.execute(dto);
            return InventoryItemMapper.toResponseDto(result);
        } catch (error) {
            
            throw error;
        }
    }
    
    @Get()
    @HttpCode(HttpStatus.OK)
    async viewAllInventoryItem(){
        const result = await this.viewAllInventoryUseCase.execute();
        if(result.length === 0) return {inventoryItems:[]};
        const response = result.map(item => InventoryMapper.toResponseDto(item));
        return {
            inventoryItems: response
        }
    }
    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    async delete(@Param('id',ParseIntPipe) id: bigint){
        try {
            const result = await this.deleteInventoryUseCase.execute(id);
            if(!result){
                throw new NotFoundException('El inventario especificado no encontrado...');
            }
            return Promise.resolve();
        } catch (error) {
            if(error instanceof InvalidInventoryException){
                throw new BadRequestException(error.message);
            }

            if(error instanceof InventoryNotFoundException) {
                throw new NotFoundException(error.message);
            }
            throw error;
        }
        
    }
}