'use server';

import { PhysicalDeleteSaleDetailUseCase } from "@/contexts/sale-management/sale-detail/application/use-case/physical-delete-sale-detail.use-case";
import { TypeormSaleDetailRepository } from "@/contexts/sale-management/sale-detail/infraestructure/persistence/typeorm/repositories/typeorm-sale-detail.repository";
import { TypeormSaleRepository } from "../../infraestructure/persistence/typeorm/repositories/typeorm-sale.repository";
import { handleError } from "@/shared/infrastructure/http/handlers/handleError";
import { Result } from "@/shared/lib/utils/result";
import { SaleDetailAppMapper } from "@/contexts/sale-management/sale-detail/application/mappers/sale-detail.app-mapper";

export async function physicalDeleteSaleDetailAction(saleId: bigint, detailId: bigint) {
    try {
        const saleDetailRepository = await TypeormSaleDetailRepository.create();
        const saleRepository = await TypeormSaleRepository.create();
        const useCase = new PhysicalDeleteSaleDetailUseCase(saleDetailRepository, saleRepository);

        const result = await useCase.execute(saleId, detailId);

        return {
            ...Result.success(SaleDetailAppMapper.toIResponse(result))
        }
    } catch (error) {
        return {
            ...handleError(error, 'physicalDeleteSaleDetailAction')
        }
    }
}