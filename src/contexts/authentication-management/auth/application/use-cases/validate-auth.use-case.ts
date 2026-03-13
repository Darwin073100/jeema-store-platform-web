import { UserRepository } from "src/contexts/authentication-management/auth/domain/repositories/user.repository";
import { EncryptionRepository } from "../../domain/repositories/encryption.repository";
import { LoginAuthDTO } from "../dtos/login-auth.dto";
import { UserEntity } from "src/contexts/authentication-management/auth/domain/entities/user.entity";

export class ValidateAuthUseCase{
    constructor(
        private userRepository: UserRepository,
        private encryprionRepository: EncryptionRepository
    ){}

    async execute(dto: LoginAuthDTO): Promise<UserEntity | null>{
        let user: UserEntity|null;
        // user = await this.userRepository.findByUsername(dto.email);
        // if(!user){
        //     return null;
        // }
    
        user = await this.userRepository.findByEmail(dto.email);
        if(!user){
            return null;
        }

        const isPasswordValid = await this.encryprionRepository.compare(dto.password, user.passwordHash.value);
        
        if(!isPasswordValid){
            return null;
        }
        
        // Retornar la entidad completa, no destructurarla
        // La contraseña está encapsulada en el objeto de dominio y no se expone en JSON
        return user;
    }
}