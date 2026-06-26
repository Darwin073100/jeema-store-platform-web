import { TransactionRepository } from "src/contexts/transaction-management/transaction/domain/repositories/transaction.repository";
import { CashSessionNotFoundException } from "../../domain/exceptions/cash-session-not-found.exception";
import { CashSessionRepository } from "../../domain/repositories/cash-session.repository";
import { CloseCashSessionDTO } from "../dtos/close-cash-session.dto";
import { TransactionEntity } from "src/contexts/transaction-management/transaction/domain/entities/transaction.entity";
import { CashSessionConflictException } from "../../domain/exceptions/cash-session-conflict.exception";

export class CloseCashSessionUseCase {
    constructor(
        private readonly repository: CashSessionRepository,
        private readonly transactionRepository: TransactionRepository
    ){}

    async execute(cashSessionId: bigint, dto: CloseCashSessionDTO){
        if(dto.actualBalance < 0){
            throw new CashSessionConflictException('El cierre no puede ser negativo.');
        }

        const cashSessionExist = await this.repository.findById(cashSessionId);
        if(!cashSessionExist){
            throw new CashSessionNotFoundException('No encontramos la caja aperturada espesificada.');
        }

        cashSessionExist.updateEndTime(dto.endTime);
        cashSessionExist.updateExpectedBalance(dto.expectedBalance);
        cashSessionExist.updateActualBalance(dto.actualBalance);
        cashSessionExist.updateDiference(dto.diference);
        cashSessionExist.updateClosingNotes(dto.closingNotes);
        cashSessionExist.updateIsClosed(true);

        const result = await this.repository.save(cashSessionExist);
         if(result.cashSessionId > BigInt(0)){
            if(cashSessionExist.diference && cashSessionExist.diference > 0){
                const transaction = TransactionEntity.create(
                    BigInt(15),
                    BigInt(dto.branchOfficeId),
                    null,
                    null,
                    dto.employeeId,
                    result.cashSessionId,
                    cashSessionExist.diference,
                    dto.closingNotes ?? 'Sobrante de caja al hacer corte de caja.'
                );
                await this.transactionRepository.save(transaction);
            }
            const transaction = TransactionEntity.create(
                BigInt(13),
                BigInt(dto.branchOfficeId),
                null,
                null,
                dto.employeeId,
                result.cashSessionId,
                result.actualBalance ?? 0,
                'Retiro de efectivo de apertura de caja.'
            );
            await this.transactionRepository.save(transaction);
        }
        return result;
    }
}