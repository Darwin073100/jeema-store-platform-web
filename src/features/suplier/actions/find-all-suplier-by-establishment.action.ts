'use server'
import { unstable_noStore } from "next/cache";
import { cookies } from "next/headers";
import { SuplierFetchRepositoryFactory } from "../infraestructure/factories/suplier-fetch-repository.factory";
import { FindAllSuplierByEstablishmentUseCase } from "../application/use-cases/find-all-suplier-by-establishment.use-case";
import { EstablishmentEntity } from "@/features/establishment/domain/entities/establishment.entity";

export async function findAllSuplierByEstablishmentId(isAddress?: boolean){
    unstable_noStore();

    const repository = SuplierFetchRepositoryFactory.create();
    const useCase = new FindAllSuplierByEstablishmentUseCase(repository);

    const cookieStore = await cookies();
    let establishmentCookie = cookieStore.get('establishmentCookie')?.value;
    let establishmentId = BigInt(0);

    if(establishmentCookie){
        const establishmentJSON = JSON.parse(establishmentCookie) as EstablishmentEntity;
        establishmentId = establishmentJSON.establishmentId; 
    }
    const result = await useCase.execute(establishmentId, isAddress ?? false);

    return {
        ...result
    }
}