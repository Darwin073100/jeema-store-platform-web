import { TransactionTypeRepository } from "src/contexts/transaction-management/transaction-type/domain/repositories/transaction-type.repository";
import { TransactionRepository } from "../../domain/repositories/transaction.repository";
import { RegisterTransactionSaleDTO } from "../dtos/register-transaction-sale.dto";
import { TransactionNotFoundException } from "../../domain/exceptions/transaction-not-found.exception";
import { TransactionEntity } from "../../domain/entities/transaction.entity";
import { BranchOfficeRepository } from "src/contexts/establishment-management/branch-office/domain/repositories/branch-office.repository";
import { SaleRepository } from "src/contexts/sale-management/sale/domain/repositories/sale.repository";
import { EmployeeRepository } from "src/contexts/employee-management/employee/domain/repositories/employee.repository";

export class RegisterTransactionSale {
    constructor(
        private readonly transactionRepository: TransactionRepository,
        private readonly transactionTypeRepository: TransactionTypeRepository,
        private readonly branchOfficeRepository: BranchOfficeRepository,
        private readonly saleRepository: SaleRepository,
        private readonly employeeRepository: EmployeeRepository 
    ){}

    async execute(dto: RegisterTransactionSaleDTO){
        const typeExist = await this.transactionTypeRepository.existById(dto.transactionTypeId);
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

        const employeeExist = await this.employeeRepository.existById(dto.employeeId);
        if(!employeeExist){
            throw new TransactionNotFoundException('No pudimos encontrar el empleado.');
        }

        const transaction = TransactionEntity.create(
            dto.transactionTypeId,
            dto.branchOfficeId,
            null,
            dto.saleId,
            dto.employeeId,
            null,
            dto.amount,
            dto.description,
        );

        const result = await this.transactionRepository.save(transaction);
        return result;
    }
}