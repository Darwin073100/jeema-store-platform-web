import { CloudEstablishmentRepository } from "../../domain/repositories/cloud-establishment.repository";

export class GenerateEnrollmentKeyUseCase {
    constructor(
        private readonly cloudEstablishmentRepository: CloudEstablishmentRepository
    ){}

    async execute(){
        const result = await this.cloudEstablishmentRepository.generateEnrollmentKey();
        return result;
    }
}