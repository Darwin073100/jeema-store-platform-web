import { UserRepository } from "../../domain/repositories/user.repository";
import { UpdateUserDTO } from "../dtos/update-user.dto";

export class UpdateUserUseCase{
    constructor(
        private readonly userRepository: UserRepository,
    ){}

    async execute(establishmentId: bigint, userId: bigint, dto: UpdateUserDTO){
        const result = await this.userRepository.update(establishmentId, userId, dto);
        return result;
    }
}