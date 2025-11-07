import { LocalTransferDTO } from "../../application/dtos/local-transfer.dto";
import { LocalTransferHttpDTO } from "../dtos/local-transfer-http.dto";

export class TransferMapper {
    static toLocalTransferHttpDto(command: LocalTransferDTO): LocalTransferHttpDTO {
        return {
            inventoryId: command.inventoryId.toString(),
            fromLocation: command.fromLocation,
            branchOfficeId: command.branchOfficeId.toString(),
            toLocation: command.toLocation,
            quantity: Number(command.quantity),
            requestedByEmployeeId: command.requestedByEmployeeId.toString(),
            notes: command.notes
        }
    }
}