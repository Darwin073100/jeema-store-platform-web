import { TransactionRepository } from "../../domain/repositories/transaction.repository";
import { AccountTypeEnum } from "../../domain/enums/account-type.enum";

export class FindAllTransactionsTypeUseCase {
    constructor(
        private readonly repository: TransactionRepository
    ){}

    async execute(accountType: AccountTypeEnum){
        const result = await this.repository.findAllTransactionsType(accountType);
        return result;
    }
}