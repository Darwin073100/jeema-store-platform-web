'use server';

import { RegisterSaleDetailUseCase } from "@/contexts/sale-management/sale-detail/application/use-case/register-sale-detail.use-case";
import { TypeormSaleRepository } from "../../infraestructure/persistence/typeorm/repositories/typeorm-sale.repository";
import { TypeormSaleDetailRepository } from "@/contexts/sale-management/sale-detail/infraestructure/persistence/typeorm/repositories/typeorm-sale-detail.repository";
import { TypeormInventoryRepository } from "@/contexts/inventory-management/inventory/infraestructure/persistence/typeorm/repositories/typeorm-inventory.repository";
import { AddDetailToSaleDto } from "@/contexts/sale-management/sale-detail/application/dtos/add-detail-to-sale.dto";
import { handleError } from "@/shared/infrastructure/http/handlers/handleError";
import { Result } from "@/shared/features/result";
import { SaleDetailAppMapper } from "@/contexts/sale-management/sale-detail/application/mappers/sale-detail.app-mapper";
import { SaleConflictException } from "../../domain/exceptions/sale-conflict.exception";

export async function addDetailToSaleAction(dto: AddDetailToSaleDto) {
    try {
        const saleRepository = await TypeormSaleRepository.create();
        const saleDetailRepository = await TypeormSaleDetailRepository.create();
        const inventoryRepository = await TypeormInventoryRepository.create();
        const useCase = new RegisterSaleDetailUseCase(saleDetailRepository, saleRepository, inventoryRepository);

        const result = await useCase.execute(dto);
        if(!result){
            throw new SaleConflictException('No se pudo agregar el producto a la venta');
        }
        return {
            ...Result.success(SaleDetailAppMapper.toIResponse(result))
        }
    } catch (error) {
        return {
            ...handleError(error, 'addDetailToSaleAction')
        }
    }
}