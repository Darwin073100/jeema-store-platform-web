import { UserRepository } from "../../domain/repositories/user.repository";

export class FindAllByEstablishmentIdUseCase{
    constructor(
        private readonly repository: UserRepository
    ){}

    async execute(establishmentId: bigint){
        const result = await this.repository.findAllByEstablishmentId(establishmentId);
        return result;
    }
}