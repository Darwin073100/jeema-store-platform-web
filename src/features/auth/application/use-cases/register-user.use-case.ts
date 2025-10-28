import { UserRepository } from "../../domain/repositories/user.repository";
import { RegisterUserDTO } from "../dtos/register-user.dto";

export class RegisterUserUseCase{
    constructor(
        private readonly userRepository: UserRepository,
    ){}

    async execute(dto: RegisterUserDTO){
        const result = await this.userRepository.save(dto);
        return result;
    }
}