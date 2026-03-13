import { UserRepository } from "../../domain/repositories/user.repository";
import { UpdateUserDTO } from "../dtos/update-user.dto";
import { EncryptionRepository } from "../../domain/repositories/encryption.repository";
import { UserNotFoundException } from "../../domain/exceptions/user-not-found.exception";

export class UpdateUserUseCase{
    constructor(
        private readonly repository: UserRepository,
        private readonly encryptionRepository: EncryptionRepository,
    ){}

    async execute(establishmentId: bigint, userId: bigint, dto: UpdateUserDTO){
        const userExist = await this.repository.findById(userId);
        if(!userExist){
            throw new UserNotFoundException('El usuario no fue encontrado');
        }

        if(dto.email){
            userExist?.updateEmail(dto.email)
        }
        if(dto.username){
            userExist?.updateUsername(dto.username)
        }
        if(dto.passwordPlain){
            const hashedPassword = await this.encryptionRepository.encrypt(dto.passwordPlain);
            userExist?.updatePasswordHash(hashedPassword)
        }
        if(dto.isActive){
            userExist.markAsActive();
        }
        if(dto.isActive === false){
            userExist.markAsInactive();
        }
        const result = await this.repository.update(establishmentId, userExist);
        return result;
    }
}