import { TransactionMapper } from "src/contexts/transaction-management/transaction/application/mappers/transaction.mapper";
import { TransactionTypeEntity } from "../../domain/entities/transaction-type.entity";
import { TransactionTypeResponseDTO } from "../dtos/transaction-type-response.dto";

export class TransactionTypeMapper{
    public static toResponseDto(entity: TransactionTypeEntity){
        const response: TransactionTypeResponseDTO = {
            transactionTypeId: entity.transactionTypeId,
            accountType: entity.accountType,
            name: entity.name,
            description: entity.description,
            createdAt: entity.createdAt,
            updatedAt: entity.updatedAt,
            deletedAt: entity.deletedAt,
            transactions: entity.transactions.map( item => TransactionMapper.toResponseDTO(item)) ?? []
        }
        return response;
    }
}