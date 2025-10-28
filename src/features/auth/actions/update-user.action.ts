'use server'
import { revalidatePath } from "next/cache";
import { UserRepositoryFactory } from "../infraestructure/factories/user-repository.factory";
import { UpdateUserDTO } from "../application/dtos/update-user.dto";
import { UpdateUserUseCase } from "../application/use-cases/update-user.use-case";
import { cookies } from "next/headers";
import { EstablishmentEntity } from "@/features/establishment/domain/entities/establishment.entity";

export async function updateUserAction(userId: bigint, dto: UpdateUserDTO) {
    const userFetchRepositoryImpl = UserRepositoryFactory.create();
    const useCase = new UpdateUserUseCase(userFetchRepositoryImpl);

    const cookieStore = await cookies();
    let establishmentString = cookieStore.get('establishmentCookie')?.value ?? null;
    let establishment: EstablishmentEntity | null = null;
    if (establishmentString) {
        establishment = JSON.parse(establishmentString) as EstablishmentEntity;
    }
    const result = await useCase.execute(establishment?.establishmentId ?? BigInt(0), userId, dto);
    
    if (result.ok) {
        revalidatePath('/configurations/employees');
        revalidatePath('/configurations/users');
    }

    return {
        ...result
    }
}