import { Result } from "@/shared/features/result";
import { TransferRepository } from "../../domain/repositories/transfer.repository";
import { LocalTransferDTO } from "../dtos/local-transfer.dto";
import { ErrorEntity } from "@/shared/features/error.entity";
import { TransferEntity } from "../../domain/entities/transfer.entity";

export class LocalTransferUseCase {
    constructor(
        private readonly transferRepository: TransferRepository
    ){}

    async execute(command: LocalTransferDTO):Promise<Result<TransferEntity, ErrorEntity>>{
        if(command.branchOfficeId <= BigInt(0)){
            return Result.failure<ErrorEntity>({
                message: 'La sucursal es inválida para realizar el traspaso local.',
                error: 'INVALID_BRANCH_OFFICE_ID',
                statusCode: 400,
                path: 'LocalTransferUseCase.execute',
                timestamp: new Date().toJSON(),
            });
        }
        if(command.requestedByEmployeeId <= BigInt(0)){
            return Result.failure<ErrorEntity>({
                message: 'El empleado que solicita el traspaso es inválido.',
                error: 'INVALID_EMPLOYEE_ID',
                statusCode: 400,
                path: 'LocalTransferUseCase.execute',
                timestamp: new Date().toJSON(),
            });
        }
        if(command.inventoryId <= BigInt(0)){
            return Result.failure<ErrorEntity>({
                message: 'El inventario es inválido.',
                error: 'INVALID_INVENTORY_ID',
                statusCode: 400,
                path: 'LocalTransferUseCase.execute',
                timestamp: new Date().toJSON(),
            });
        }
        if(command.fromLocation === command.toLocation){
            return Result.failure<ErrorEntity>({
                message: 'Las ubicaciones de origen y destino no pueden ser las mismas.',
                error: 'INVALID_LOCATION',
                statusCode: 400,
                path: 'LocalTransferUseCase.execute',
                timestamp: new Date().toJSON(),
            });
        }
        if(command.quantity <= 0){
            return Result.failure<ErrorEntity>({
                message: 'La cantidad debe ser mayor que cero.',
                error: 'INVALID_QUANTITY',
                statusCode: 400,
                path: 'LocalTransferUseCase.execute',
                timestamp: new Date().toJSON(),
            });
        }
        const result = await this.transferRepository.localTransfer(command);
        return result;
    }
}