import { CashRegisterRepository } from "src/contexts/cash-management/cash-register/domain/repositories/cash-register.repository";
import { CashSessionRepository } from "../../domain/repositories/cash-session.repository";
import { EmployeeRepository } from "src/contexts/employee-management/employee/domain/repositories/employee.repository";
import { OpenCashSessionDTO } from "../dtos/open-cash-session.dto";
import { CashSessionNotFoundException } from "../../domain/exceptions/cash-session-not-found.exception";
import { CashSessionConflictException } from "../../domain/exceptions/cash-session-conflict.exception";
import { CashSessionEntity } from "../../domain/entities/cash-session.entity";
import { TransactionRepository } from "src/contexts/transaction-management/transaction/domain/repositories/transaction.repository";
import { TransactionEntity } from "src/contexts/transaction-management/transaction/domain/entities/transaction.entity";

export class OpenCashSessionUseCase {
    constructor(
        private readonly cashSesssionRepo: CashSessionRepository,
        private readonly cashRegisterRepo: CashRegisterRepository,
        private readonly employeeRepo: EmployeeRepository,
        private readonly transactionRepo: TransactionRepository,
    ){}

    async execute(command: OpenCashSessionDTO){
        const cashRegisterExist = await this.cashRegisterRepo.existById(command.cashRegisterId);
        if(!cashRegisterExist) throw new CashSessionNotFoundException(`La caja por aperturar no existe.`);
        
        const employeeExist = await this.employeeRepo.existById(command.employeeId);
        if(!employeeExist) throw new CashSessionNotFoundException(`El empleado que va a aperturar caja no existe.`);
        
        const isClosed = await this.cashSesssionRepo.isClosedCashSession(command.cashRegisterId);
        if(!!isClosed) throw new CashSessionConflictException(`La caja por aperturar, ya está aperturada, haz el corte del día y luego apertura.`);

        const entity = CashSessionEntity.create(
            command.cashRegisterId,
            command.employeeId,
            command.startTime,
            Number(command.startBalance.toFixed(2))
        );

        const result = await this.cashSesssionRepo.save(entity);
        if(result.cashSessionId > BigInt(0)){
            const transaction = TransactionEntity.create(
                BigInt(3),
                BigInt(command.branchOfficeId),
                null,
                null,
                command.employeeId,
                result.cashSessionId,
                command.startBalance,
                'Apertura de Caja.'
            );
            await this.transactionRepo.save(transaction);
        }
        return result;
    }
}