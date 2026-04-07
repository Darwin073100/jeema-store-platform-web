'use server'

import { handleError } from "@/shared/infrastructure/http/handlers/handleError";
import { LoginAuthDTO } from "../../application/dtos/login-auth.dto";
import { ValidateAuthUseCase } from "../../application/use-cases/validate-auth.use-case";
import { BcryptEncryptionRepository } from "../../infraestructure/encryption/bcrypt.encryption.repository";
import { TyperomUserRepository } from "../../infraestructure/repositories/typeorm-user.repository";
import { Result } from "@/shared/features/result";
import { IUser } from "../interfaces/IUser";
import { UserMapper } from "../../application/mapper/user.mapper";
import { ErrorEntity } from "@/shared/features/error.entity";

export async function validateAuthAction(dto: LoginAuthDTO):Promise<{
    ok: boolean;
    value?: IUser;
    error?: ErrorEntity;
}> {
    try {
        const userRepository = await TyperomUserRepository.create();
        const encryptionRepository = await BcryptEncryptionRepository.create();
        const authLoginUseCase = new ValidateAuthUseCase(userRepository, encryptionRepository);

        const result = await authLoginUseCase.execute(dto);
        const user: IUser = UserMapper.toIResponse(result)
        return {
            ...Result.success(user)
        }
    }catch(error){
        return {
            ...handleError(error, 'validateAuthAction')
        }
    }
}