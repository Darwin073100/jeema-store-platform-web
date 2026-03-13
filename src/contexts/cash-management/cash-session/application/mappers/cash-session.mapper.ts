import { CashRegisterMapper } from "src/contexts/cash-management/cash-register/application/mappers/cash-register.mapper";
import { CashSessionEntity } from "../../domain/entities/cash-session.entity";
import { CashSessionResponseDTO } from "../dtos/cash-session-response.dto";
import { EmployeeMapper } from "src/contexts/employee-management/employee/application/mappers/employee.mapper";
import { TransactionMapper } from "src/contexts/transaction-management/transaction/application/mappers/transaction.mapper";

export class CashSessionMapper {
    public static toResponseDto(domainEntity: CashSessionEntity): CashSessionResponseDTO {
        const dto: CashSessionResponseDTO = {
            cashSessionId: domainEntity.cashSessionId,
            cashRegisterId: domainEntity.cashRegisterId,
            employeeId: domainEntity.employeeId,
            startTime: domainEntity.startTime,
            startBalance: domainEntity.startBalance,
            endTime: domainEntity.endTime,
            expectedBalance: domainEntity.expectedBalance,
            actualBalance: domainEntity.actualBalance,
            diference: domainEntity.diference,
            isClosed: domainEntity.isClosed,
            closingNotes: domainEntity.closingNotes,
            createdAt: domainEntity.createdAt,
            updatedAt: domainEntity.updatedAt,
            deletedAt: domainEntity.deletedAt,
            cashRegister: domainEntity.cashRegister ? CashRegisterMapper.toResponse(domainEntity.cashRegister): null,
            employee: domainEntity.employee ? EmployeeMapper.toResponseDto(domainEntity.employee) : null,
            transactions: domainEntity.transactions ? domainEntity.transactions.map(transaction => TransactionMapper.toResponseDTO(transaction)) : [],
        }
        return dto;
    }
}