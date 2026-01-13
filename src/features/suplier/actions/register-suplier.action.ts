'use server'
import { cookies } from "next/headers";
import { RegisterSuplierDto } from "../application/dtos/register-suplier.dto";
import { RegisterSuplierUseCase } from "../application/use-cases/register-suplier.use-case";
import { SuplierFetchRepositoryFactory } from "../infraestructure/factories/suplier-fetch-repository.factory";
import { EstablishmentEntity } from "@/features/establishment/domain/entities/establishment.entity";
import { revalidatePath } from "next/cache";

export async function registerSuplierAction(dto: Omit<RegisterSuplierDto, 'establishmentId'>){
    const repository = SuplierFetchRepositoryFactory.create();
    const useCase = new RegisterSuplierUseCase(repository);

    const cookieStore = await cookies();
    let establishmentCookie = cookieStore.get('establishmentCookie')?.value;
    let establishmentId = BigInt(0);
    if(establishmentCookie){
        const establishmentJSON = JSON.parse(establishmentCookie) as EstablishmentEntity;
        establishmentId = establishmentJSON.establishmentId; 
    }

    const currentDto: RegisterSuplierDto = {
        ...dto,
        establishmentId
    }

    const result = await useCase.execute(currentDto);
    if(result.ok){
        revalidatePath('/products/supliers');
    }
    return {
        ...result
    }
}