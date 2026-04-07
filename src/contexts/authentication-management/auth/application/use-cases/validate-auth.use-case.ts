import { UserRepository } from "src/contexts/authentication-management/auth/domain/repositories/user.repository";
import { EncryptionRepository } from "../../domain/repositories/encryption.repository";
import { LoginAuthDTO } from "../dtos/login-auth.dto";
import { UserEntity } from "src/contexts/authentication-management/auth/domain/entities/user.entity";
import { UserConflictException } from "../../domain/exceptions/user-conflict.exception";

export class ValidateAuthUseCase{
    constructor(
        private userRepository: UserRepository,
        private encryprionRepository: EncryptionRepository
    ){}

    async execute(dto: LoginAuthDTO): Promise<UserEntity>{
        let user: UserEntity|null;
        user = await this.userRepository.findByUsername(dto.email);
        if(!user){
            user = await this.userRepository.findByEmail(dto.email);
            if(!user){
                throw new UserConflictException('Usuario, Email o Contraseña incorrecta');
            }
        }
    
        const isPasswordValid = await this.encryprionRepository.compare(dto.password, user.passwordHash.value);
        
        if(!isPasswordValid){
            throw new UserConflictException('Usuario, Email o Contraseña incorrecta');
        }        
        // Retornar la entidad completa, no destructurarla
        // La contraseña está encapsulada en el objeto de dominio y no se expone en JSON
        return user;
    }
}