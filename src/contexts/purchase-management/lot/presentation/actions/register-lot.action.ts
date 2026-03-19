'use server'
import { revalidatePath } from "next/cache";
import { RegisterLotDto } from "../../application/dtos/register-lot.dto";
import { TypeOrmLotRepository } from "../../infraestructura/persistence/typeorm/repositories/typeorm-lot.repository";
import { RegisterLotUseCase } from "../../application/use-case/register-lot.use-case";
import { TypeOrmProductRepository } from "@/contexts/product-management/product/infraestructure/persistence/typeorm/repositories/typeorm-product.repository";
import { Result } from "@/shared/features/result";
import { LotMapper } from "../../application/mappers/lot.mapper";
import { handleError } from "@/shared/infrastructure/http/handlers/handleError";

export async function registerLotAction(dto: RegisterLotDto) {
    try {
        const lotRepository = await TypeOrmLotRepository.create();
        const productRepository = await TypeOrmProductRepository.create();

        const registerLotUseCase = new RegisterLotUseCase(lotRepository, productRepository);

        const result = await registerLotUseCase.execute(dto);

        revalidatePath('/products');

        return {
            ...Result.success(LotMapper.toIResponse(result))
        };
    } catch (error) {
        console.error('registerLotAction: ', error);
        return {
            ...handleError(error, 'registerLotAction')
        }
    }
}