import { TransactionTypeRepository } from "src/contexts/transaction-management/transaction-type/domain/repositories/transaction-type.repository";
import { TransactionRepository } from "../../domain/repositories/transaction.repository";
import { RegisterTransactionSaleDTO } from "../dtos/register-transaction-sale.dto";
import { TransactionNotFoundException } from "../../domain/exceptions/transaction-not-found.exception";
import { TransactionEntity } from "../../domain/entities/transaction.entity";
import { BranchOfficeRepository } from "src/contexts/establishment-management/branch-office/domain/repositories/branch-office.repository";
import { SaleRepository } from "src/contexts/sale-management/sale/domain/repositories/sale.repository";
import { EmployeeRepository } from "src/contexts/employee-management/employee/domain/repositories/employee.repository";
import { RegisterTransactionDTO } from "../dtos/register-transaction.dto";
import { CashSessionRepository } from "src/contexts/cash-management/cash-session/domain/repositories/cash-session.repository";
import { TransactionConflictException } from "../../domain/exceptions/transaction-conflict.exception";
import { AccountTypeEnum } from "src/contexts/transaction-management/transaction-type/domain/enums/account-type.enum";

export class RegisterTransactionUseCase {
    constructor(
        private readonly transactionRepository: TransactionRepository,
        private readonly transactionTypeRepository: TransactionTypeRepository,
        private readonly branchOfficeRepository: BranchOfficeRepository,
        private readonly saleRepository: SaleRepository,
        private readonly employeeRepository: EmployeeRepository,
        private readonly cashSessionRepository: CashSessionRepository
    ){}

    async execute(dto: RegisterTransactionDTO){
        const typeExist = await this.transactionTypeRepository.findById(dto.transactionTypeId);
        if(!typeExist){
            throw new TransactionNotFoundException('No pudimos encontrar el tipo de transacción.');
        }
        const branchExist = await this.branchOfficeRepository.existById(dto.branchOfficeId);
        if(!branchExist){
            throw new TransactionNotFoundException('No pudimos encontrar la sucursal.');
        }
        
        if(dto.saleId){
            const saleExist = await this.saleRepository.existById(dto.saleId);
            if(!saleExist){
                throw new TransactionNotFoundException('No pudimos encontrar la venta.');
            }
        }
        if(dto.cashSessionId){
            const cashSessionExist = await this.cashSessionRepository.findCashSessionWitTransactions(dto.cashSessionId);
            if(!cashSessionExist){
                throw new TransactionNotFoundException('Apertura de caja no encontrada.');
            }
            if(cashSessionExist.isClosed){
                throw new TransactionConflictException('La caja no está aperturada.');
            }
            let income = 0;
            let expense = 0;
            let totalAmount = 0;
            cashSessionExist.transactions
                ?.filter(item => item.transactionType?.accountType === AccountTypeEnum.INCOME)
                ?.filter(item => item.transactionType?.name !== 'Apertura de Caja')
                .forEach(item => income = income + Number(item.amount));
            cashSessionExist.transactions
                ?.filter(item => item.transactionType?.accountType === AccountTypeEnum.EXPENSE)
                ?.filter(item => item.transactionType?.name !== 'Retiro de efectivo/Corte de caja')
                .forEach(item => expense = expense + Number(item.amount));
            
            totalAmount = income - expense;
            
            if(typeExist.accountType === AccountTypeEnum.INCOME){
                totalAmount = totalAmount + Number(dto.amount);
            } else {
                totalAmount = totalAmount - Number(dto.amount);
            }
            console.log(income);
            console.log(expense);
            console.log(totalAmount);

            if(totalAmount < 0){
                throw new TransactionConflictException('La salida de efectivo no puede tomerse del fondo de caja.');
            }           
            
        }

        const employeeExist = await this.employeeRepository.existById(dto.employeeId);
        if(!employeeExist){
            throw new TransactionNotFoundException('No pudimos encontrar el empleado.');
        }

        const transaction = TransactionEntity.create(
            dto.transactionTypeId,
            dto.branchOfficeId,
            dto.purchaseId,
            dto.saleId,
            dto.employeeId,
            dto.cashSessionId,
            dto.amount,
            dto.description,
        );

        const result = await this.transactionRepository.save(transaction);
        return result;
    }
}