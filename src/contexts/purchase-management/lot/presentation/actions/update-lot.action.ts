'use server'
import { revalidatePath } from "next/cache";
import { UpdateLotDto } from "../../application/dtos/update-lot.dto";
import { TypeOrmLotRepository } from "../../infraestructura/persistence/typeorm/repositories/typeorm-lot.repository";
import { UpdateLotUseCase } from "../../application/use-case/update-lot.use-case";
import { TypeOrmProductRepository } from "@/contexts/product-management/product/infraestructure/persistence/typeorm/repositories/typeorm-product.repository";
import { Result } from "@/shared/features/result";
import { LotMapper } from "../../application/mappers/lot.mapper";
import { handleError } from "@/shared/infrastructure/http/handlers/handleError";

export async function updateLotAction(dto: UpdateLotDto) {
    try {
        const lotRepository = await TypeOrmLotRepository.create();
        const productRepository = await TypeOrmProductRepository.create();

        const useCase = new UpdateLotUseCase(lotRepository, productRepository);

        const result = await useCase.execute(dto);

        revalidatePath('/products');

        return {
            ...Result.success(LotMapper.toIResponse(result))
        };
    } catch (error) {
        console.error('updateLotAction: ', error);
        return {
            ...handleError(error, 'updateLotAction')
        }
    }
}