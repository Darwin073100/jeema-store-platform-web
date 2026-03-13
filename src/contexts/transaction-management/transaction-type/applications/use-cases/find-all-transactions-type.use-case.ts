import { AccountTypeEnum } from "../../domain/enums/account-type.enum";
import { TransactionTypeRepository } from "../../domain/repositories/transaction-type.repository";

export class FindAllTransactionsTypeUseCase {
    constructor(
        private readonly transactionTypeRepository: TransactionTypeRepository
    ){}

    async execute(accountType: AccountTypeEnum){
        const result = await this.transactionTypeRepository.findAllByName(accountType);
        return result;
    }
}