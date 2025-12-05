import { ErrorEntity } from "@/shared/features/error.entity";
import { EstablishmentEntity } from "../entities/establishment.entity";
import { Result } from "@/shared/features/result";
import { CreateEstablishmentDTO } from "../../application/dtos/create-establishment.dto";

export interface EstablishmentRepository{
    save(data: CreateEstablishmentDTO):Promise<Result<EstablishmentEntity,ErrorEntity>>;
    findById(establishmentId: bigint):Promise<Result<EstablishmentEntity,ErrorEntity>>;
}