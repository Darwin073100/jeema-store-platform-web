import { BadRequestException, Body, ConflictException, Controller, Delete, Get, HttpCode, HttpStatus, InternalServerErrorException, NotFoundException, Param, Patch, Post } from "@nestjs/common";
import { RegisterInventoryItemUseCase } from "../../application/use-case/register-inventory-item.use-case";
import { InventoryItemRequestDTO } from "../dtos/inventory-item-request.dto";
import { InventoryItemNotFoundException } from "../../domain/exceptions/inventory-item-not-found.exception";
import { InvalidInventoryItemException } from "../../domain/exceptions/invalid-inventory-item.exception";
import { InventoryItemMapper } from "../../application/mapper/inventory-item.mapper";
import { ViewAllInventoryItemUseCase } from "../../application/use-case/view-all-inventory-item.use-case";
import { UpdateInventoryItemRequestDTO } from "../dtos/update-inventory-item-request.dto";
import { UpdateInventoryItemUseCase } from "../../application/use-case/update-inventory-item.use-case";
import { InventoryItemAlreadyExistException } from "../../domain/exceptions/inventory-item-already-exist.exception";
import { DeleteInventoryItemUseCase } from "../../application/use-case/delete-inventory-item.use-case";
import { DeleteInventoryItemRequestDTO } from "../dtos/delete-inventory-item-request.dto";

@Controller('inventory-items')
export class InventoryItemController{
    constructor(
        private readonly registerInventoryItemUseCase: RegisterInventoryItemUseCase,
        private readonly viewAllInventoryItemUseCase: ViewAllInventoryItemUseCase,
        private readonly updateInventoryItemUseCase: UpdateInventoryItemUseCase,
        private readonly deleteInventoryItemUseCase: DeleteInventoryItemUseCase,
    ){}

    // Endpoint para registrar un nuevo item de inventario
    @Post()
    @HttpCode(HttpStatus.CREATED)
    async register(@Body() inventoryItemDto: InventoryItemRequestDTO) {
        try {
            const result = await this.registerInventoryItemUseCase.execute({
            inventoryId: inventoryItemDto.inventoryId,
            location: inventoryItemDto.location,
            quantityOnHan: inventoryItemDto.quantityOnHand,
        });
        return InventoryItemMapper.toResponseDto(result);
        } catch (error) {
            if(error instanceof InvalidInventoryItemException){
                throw new BadRequestException(error.message);
            }

            if(error instanceof InventoryItemNotFoundException) {
                throw new NotFoundException(error.message);
            }

            if(error instanceof InventoryItemAlreadyExistException) {
                throw new ConflictException(error.message);
            }
            throw error;
        }

    }
    @Patch()
    @HttpCode(HttpStatus.OK)
    async update(@Body() dto: UpdateInventoryItemRequestDTO) {
        try {
            const result = await this.updateInventoryItemUseCase.execute({
                inventoryItemId: dto.inventoryItemId,
                inventoryId: dto.inventoryId,
                location: dto.location,
                quantityOnHan: dto.quantityOnHand,
            });
            
            return InventoryItemMapper.toResponseDto(result);
        } catch (error) {
            if(error instanceof InvalidInventoryItemException){
                throw new BadRequestException(error.message);
            }

            if(error instanceof InventoryItemNotFoundException) {
                throw new NotFoundException(error.message);
            }
            throw error;
        }

    }
    @Delete(':inventoryItemId')
    @HttpCode(HttpStatus.NO_CONTENT)
    async delete(@Param() dto: DeleteInventoryItemRequestDTO) {
        try {
            const inventoryId = BigInt(dto.inventoryItemId);
            const result = await this.deleteInventoryItemUseCase.execute(inventoryId);
            if(!result){
                throw new InternalServerErrorException('No se pudo eliminar el item de inventario.')
            }
            return Promise.resolve();
        } catch (error) {
            if(error instanceof InvalidInventoryItemException){
                throw new BadRequestException(error.message);
            }

            if(error instanceof InventoryItemNotFoundException) {
                throw new NotFoundException(error.message);
            }
            throw error;
        }

    }

    @Get()
    @HttpCode(HttpStatus.OK)
    async viewAllInventoryItem(){
        const result = await this.viewAllInventoryItemUseCase.execute();
        if(result.length === 0) return {inventoryItems:[]};
        const response = result.map(item => InventoryItemMapper.toResponseDto(item));
        return {
            inventoryItems: response
        }
    }
}