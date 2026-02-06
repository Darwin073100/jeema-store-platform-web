import { ErrorEntity } from "@/shared/features/error.entity";
import type { EstablishmentEntity } from "../../domain/entities/establishment.entity";
import { Result } from "@/shared/features/result";
import { EstablishmentRepository } from "../../domain/repositories/establishment.repository";

export class UpdateEstablishmentUseCase{
    constructor(
        private readonly establishmentRepository: EstablishmentRepository,
    ){}

    async execute(establishmentId: bigint, name: string):Promise<Result<EstablishmentEntity,ErrorEntity>>{
        return await this.establishmentRepository.update(establishmentId, name);
    }
}