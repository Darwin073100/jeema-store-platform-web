'use server'
import { IEstablishment } from "@/contexts/establishment-management/establishment/presentation/interfaces/IEstablishment";
import { cookies } from "next/headers";
import { TypeOrmSuplierRepository } from "../../infraestructure/persistence/typeorm/repositories/typeorm-suplier.repository";
import { FindAllSuplierByEstablishmentUseCase } from "../../application/use-cases/find-all-supliers-by-establishment.use-case";
import { Result } from "@/shared/features/result";
import { SuplierMapper } from "../../application/mappers/suplier.mapper";

export async function findAllSuplierByEstablishmentId(isAddress?: boolean) {
    try {
        const repository = await TypeOrmSuplierRepository.create();
        const useCase = new FindAllSuplierByEstablishmentUseCase(repository);

        const cookieStore = await cookies();
        let establishmentCookie = cookieStore.get('establishmentCookie')?.value;
        let establishmentId = BigInt(0);

        if (establishmentCookie) {
            const establishmentJSON = JSON.parse(establishmentCookie) as IEstablishment;
            establishmentId = establishmentJSON.establishmentId;
        }
        const result = await useCase.execute(establishmentId, isAddress ?? false);

        return {
            ...Result.success({supliers: result.map(item => SuplierMapper.toIResponse(item))})
        }
    } catch (error) {
        console.error('findAllSuplierByEstablishmentId', error);
        return {
            ...Result.success({supliers: []})
        }
    }
}