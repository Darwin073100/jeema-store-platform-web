import { Result } from "@/shared/features/result";
import { TransferEntity } from "../entities/transfer.entity";
import { ErrorEntity } from "@/shared/features/error.entity";
import { LocalTransferDTO } from "../../application/dtos/local-transfer.dto";

export interface TransferRepository {
    localTransfer(command: LocalTransferDTO): Promise<Result<TransferEntity, ErrorEntity>>
}