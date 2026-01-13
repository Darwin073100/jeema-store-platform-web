import { Result } from "@/shared/features/result";
import { SuplierEntity } from "../entities/suplier.entity";
import { ErrorEntity } from "@/shared/features/error.entity";

export interface SuplierRepository {
    findAllByEstablishmentId(establishmentId: bigint, isAddress: boolean): Promise<Result<{supliers: SuplierEntity[]}, ErrorEntity>>
}