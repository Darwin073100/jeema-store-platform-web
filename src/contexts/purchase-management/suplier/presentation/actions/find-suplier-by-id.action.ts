'use server'
import { handleError } from "@/shared/infrastructure/http/handlers/handleError";
import { FindSuplierByIdUseCase } from "../../application/use-cases/find-suplier-by-id.use-case";
import { TypeOrmSuplierRepository } from "../../infraestructure/persistence/typeorm/repositories/typeorm-suplier.repository"
import { SuplierNotFoundException } from "../../domain/exceptions/suplier-not-found.exception";
import { Result } from "@/shared/lib/utils/result";
import { SuplierMapper } from "../../application/mappers/suplier.mapper";

export async function findSuplierByIdAction(suplierId: bigint) {
    try {
        const repository = await TypeOrmSuplierRepository.create();
        const useCase = new FindSuplierByIdUseCase(repository);

        const result = await useCase.execute(suplierId);
        
        if(!result){
            throw new SuplierNotFoundException('Proveedor no encontrado.');
        }

        return {
            ...Result.success(SuplierMapper.toIResponse(result))
        }
    } catch (error) {
        return {
            ...handleError(error, 'findSuplierByIdAction')
        }
    }
}