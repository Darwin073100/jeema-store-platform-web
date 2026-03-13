import { BadRequestException, Body, ConflictException, Controller, Get, HttpCode, HttpStatus, NotFoundException, Post } from "@nestjs/common";
import { RegisterTransactionSale } from "../../application/use-cases/register-transaction-sale.use-case";
import { TransactionNotFoundException } from "../../domain/exceptions/transaction-not-found.exception";
import { TransactionInvalidException } from "../../domain/exceptions/transaction-invalid.exception";
import { TransactionTypeInvalidException } from "src/contexts/transaction-management/transaction-type/domain/exceptions/transaction-type-invalid.exception";
import { TransactionMapper } from "../../application/mappers/transaction.mapper";
import { ManyFilterTransactionsDTO } from "../../application/dtos/many-filter-transactions.dto";
import { ManyFilterTransactionsRequestDTO } from "../dtos/many-filter-transactions-request.dto";
import { FindAllManyFilterTransactionsUseCase } from "../../application/use-cases/find-all-many-filter-transactions.use-case";
import { RegisterTransactionRequestDTO } from "../dtos/register-transaction-request.dto copy";
import { RegisterTransactionDTO } from "../../application/dtos/register-transaction.dto";
import { TransactionConflictException } from "../../domain/exceptions/transaction-conflict.exception";
import { FindAllTransactionsTypeUseCase } from "src/contexts/transaction-management/transaction-type/applications/use-cases/find-all-transactions-type.use-case";
import { FindAllTransactionsTypeRequestDTO } from "src/contexts/transaction-management/transaction-type/presentation/dtos/find-all-transactions-type-request.dto";
import { TransactionTypeMapper } from "src/contexts/transaction-management/transaction-type/applications/mappers/transaction-type.mapper";
import { RegisterTransactionUseCase } from "../../application/use-cases/register-transaction.use-case";

@Controller('transactions')
export class TransactionController {
    constructor(
        private readonly register: RegisterTransactionUseCase,
        private readonly findManyFilter: FindAllManyFilterTransactionsUseCase,
        private readonly findAllTransactionsTypeUseCase: FindAllTransactionsTypeUseCase
    ){}

    @Post()
    @HttpCode(HttpStatus.CREATED)
    async registerTransaction(@Body() command: RegisterTransactionRequestDTO){
        try {
            const dto: RegisterTransactionDTO = {
                transactionTypeId: command.transactionTypeId,
                branchOfficeId: command.branchOfficeId,
                employeeId: command.employeeId,
                saleId: command.saleId ?? null,
                cashSessionId: command.cashSessionId ?? null,
                purchaseId: command.purchaseId ?? null,
                amount: command.amount,
                description: command.description ?? null,
            }
            const result = await this.register.execute(dto);
            return TransactionMapper.toResponseDTO(result);
        } catch (error) {
            if(error instanceof TransactionNotFoundException){
                throw new NotFoundException(error.message);
            }
            if(error instanceof TransactionInvalidException || error instanceof TransactionTypeInvalidException){
                throw new BadRequestException(error.message);
            }
            if(error instanceof TransactionConflictException){
                throw new ConflictException(error.message);
            }
            throw error;
        }
    }
    @Post('filters')
    @HttpCode(HttpStatus.OK)
    async findManyFilterTransactions(@Body() command: ManyFilterTransactionsRequestDTO){
        try {
            const dto: ManyFilterTransactionsDTO = {
                establishmentId: command.establishmentId,
                branchOfficeId: command.branchOfficeId ?? null,
                cashSessionId: command.cashSessionId ?? null,
                employeeId: command.employeeId ?? null,
                saleId: command.saleId ?? null,
                dateEnd: command.dateEnd ?? null,
                dateInit: command.dateInit ?? null,
                transactionType: command.transactionType ?? null,
            }
            const result = await this.findManyFilter.execute(dto);
            return {
                transactions: result.map(item => TransactionMapper.toResponseDTO(item)),
            };
        } catch (error) {
            if(error instanceof TransactionNotFoundException){
                throw new NotFoundException(error.message);
            }
            if(error instanceof TransactionInvalidException || error instanceof TransactionTypeInvalidException){
                throw new BadRequestException(error.message);
            }
            throw error;
        }
    }
    @Post('types')
    @HttpCode(HttpStatus.OK)
    async findAllTransactionsType(@Body() command: FindAllTransactionsTypeRequestDTO){
        try {
            const result = await this.findAllTransactionsTypeUseCase.execute(command.accountType);
            return {
                transactionsType: result.map(item => TransactionTypeMapper.toResponseDto(item)),
            };
        } catch (error) {
            if(error instanceof TransactionNotFoundException){
                throw new NotFoundException(error.message);
            }
            if(error instanceof TransactionInvalidException || error instanceof TransactionTypeInvalidException){
                throw new BadRequestException(error.message);
            }
            throw error;
        }
    }
}