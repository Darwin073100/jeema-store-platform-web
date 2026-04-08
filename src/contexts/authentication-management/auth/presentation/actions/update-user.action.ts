'use server'
import { IEstablishment } from "@/contexts/establishment-management/establishment/presentation/interfaces/IEstablishment";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { UpdateUserUseCase } from "../../application/use-cases/update-user.use-case";
import { UpdateUserDTO } from "../../application/dtos/update-user.dto";
import { TyperomUserRepository } from "../../infraestructure/repositories/typeorm-user.repository";
import { BcryptEncryptionRepository } from "../../infraestructure/encryption/bcrypt.encryption.repository";
import { handleError } from "@/shared/infrastructure/http/handlers/handleError";
import { Result } from "@/shared/lib/utils/result";
import { UserMapper } from "../../application/mapper/user.mapper";

export async function updateUserAction(userId: bigint, dto: UpdateUserDTO) {
    try {
        const userRepository = await TyperomUserRepository.create();
        const encryptionRepository = await BcryptEncryptionRepository.create();
        const useCase = new UpdateUserUseCase(userRepository, encryptionRepository);

        const cookieStore = await cookies();
        let establishmentString = cookieStore.get('establishmentCookie')?.value ?? null;
        let establishment: IEstablishment | null = null;
        if (establishmentString) {
            establishment = JSON.parse(establishmentString) as IEstablishment;
        }
        const result = await useCase.execute(establishment?.establishmentId ?? BigInt(0), userId, dto);

        revalidatePath('/configurations/employees');
        revalidatePath('/configurations/users');

        return {
            ...Result.success(UserMapper.toIResponse(result))
        }
    } catch (error) {
        return {
            ...handleError(error, 'updateUserAction')
        }
    }
}