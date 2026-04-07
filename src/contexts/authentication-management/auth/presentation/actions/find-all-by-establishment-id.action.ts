'use server'
import { cookies } from "next/headers";
import { TyperomUserRepository } from "../../infraestructure/repositories/typeorm-user.repository";
import { FindAllByEstablishmentIdUseCase } from "../../application/use-cases/find-all-by-establishment-id.use-case";
import { IEstablishment } from "@/contexts/establishment-management/establishment/presentation/interfaces/IEstablishment";
import { Result } from "@/shared/features/result";
import { UserMapper } from "../../application/mapper/user.mapper";
import { UserNotFoundException } from "../../domain/exceptions/user-not-found.exception";

export async function findAllByEstablishmentIdAction() {
    try {
        const userFetchRepositoryImpl = await TyperomUserRepository.create();
        const useCase = new FindAllByEstablishmentIdUseCase(userFetchRepositoryImpl);

        const cookieStore = await cookies();
        let establishment;

        if (cookieStore.has('establishmentCookie')) {
            establishment = cookieStore.get('establishmentCookie')?.value ?? null;
            if (establishment) {
                establishment = JSON.parse(establishment) as IEstablishment;
                const result = await useCase.execute(establishment.establishmentId);
                return {
                    ...Result.success({users: result.map(item => UserMapper.toIResponse(item))})
                }
            }
        } else {
            throw new UserNotFoundException('No encontramos a los usuarios.');
        }
    } catch (error) {
        console.error({error});
        return {
            ...Result.success({users: []})
        }
    }
}