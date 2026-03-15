import { TransactionTypeMapper } from "src/contexts/transaction-management/transaction-type/applications/mappers/transaction-type.mapper";
import { TransactionEntity } from "../../domain/entities/transaction.entity";
import { TransactionResponseDTO } from "../dtos/transaction.response.dto";
import { BranchOfficeMapper } from "src/contexts/establishment-management/branch-office/application/mappers/branch-office.mapper";
import { EmployeeMapper } from "src/contexts/employee-management/employee/application/mappers/employee.mapper";
import { SaleMapper } from "src/contexts/sale-management/sale/application/mappers/sale-mapper";
import { ITransaction } from "../../presentation/interfaces/ITransaction";

export class TransactionMapper {
    public static toResponseDTO(entity: TransactionEntity){
        const response: TransactionResponseDTO = {
            transactionId: entity.transactionId,
            transactionTypeId: entity.transactionTypeId,
            branchOfficeId: entity.branchOfficeId,
            purchaseId: entity.purchaseId,
            saleId: entity.saleId,
            employeeId: entity.employeeId,
            cashSessionId: entity.cashSessionId,
            amount: Number(entity.amount),
            description: entity.description,
            createdAt: entity.createdAt,
            updatedAt: entity.updatedAt,
            deletedAt: entity.deletedAt,
            transactionType: entity.transactionType? TransactionTypeMapper.toResponseDto(entity.transactionType): null,
            branchOffice: entity.branchOffice? BranchOfficeMapper.toResponseDto(entity.branchOffice): null,
            employee: entity.employee? EmployeeMapper.toResponseDto(entity.employee): null,
            sale: entity.sale? SaleMapper.toResponseDto(entity.sale): null
        }
        return response;
    }
    public static toIResponse(entity: TransactionEntity){
        const response: ITransaction = {
            transactionId: entity.transactionId,
            transactionTypeId: entity.transactionTypeId,
            branchOfficeId: entity.branchOfficeId,
            purchaseId: entity.purchaseId,
            saleId: entity.saleId,
            employeeId: entity.employeeId,
            cashSessionId: entity.cashSessionId,
            amount: Number(entity.amount),
            description: entity.description,
            createdAt: entity.createdAt,
            updatedAt: entity.updatedAt,
            deletedAt: entity.deletedAt,
            transactionType: entity.transactionType? TransactionTypeMapper.toResponseDto(entity.transactionType): null,
            branchOffice: entity.branchOffice? BranchOfficeMapper.toIResponse(entity.branchOffice): null,
            employee: entity.employee? EmployeeMapper.toIResponse(entity.employee): null,
            sale: entity.sale? SaleMapper.toResponseDto(entity.sale): null
        }
        return response;
    }
}