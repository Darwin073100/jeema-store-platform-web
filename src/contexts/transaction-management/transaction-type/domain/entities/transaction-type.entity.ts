import { TransactionEntity } from "src/contexts/transaction-management/transaction/domain/entities/transaction.entity";
import { AccountTypeEnum } from "../enums/account-type.enum";
import { TransactionTypeDescriptionVO } from "../value-objects/transaction-type-description.vo";
import { TransactionTypeNameVO } from "../value-objects/transaction-type-name.vo";


export class TransactionTypeEntity {
    private readonly _transactionTypeId: bigint;
    private _name: TransactionTypeNameVO;
    private _description: TransactionTypeDescriptionVO;
    private _accountType: AccountTypeEnum;
    private readonly _createdAt: Date;
    private _updatedAt: Date | null;
    private _deletedAt: Date | null;
    private _transactions: TransactionEntity[];

    constructor(
        transactionTypeId: bigint,
        name: string,
        description: string | null,
        accountType: AccountTypeEnum,
        createdAt: Date,
        updatedAt: Date | null,
        deletedAt: Date | null,
        transactions: TransactionEntity[],
    ){

        this._transactionTypeId = transactionTypeId;
        this._name = TransactionTypeNameVO.create(name);
        this._description = TransactionTypeDescriptionVO.create(description);
        this._accountType = accountType;
        this._createdAt = createdAt;
        this._updatedAt = updatedAt;
        this._deletedAt = deletedAt;
        this._transactions = transactions;
    }

    public static reconstitute(
        transactionTypeId: bigint,
        name: string,
        description: string | null,
        accountType: AccountTypeEnum,
        createdAt: Date,
        updatedAt: Date | null,
        deletedAt: Date | null,
        transactions: TransactionEntity[],
    ){
        return new TransactionTypeEntity(
            transactionTypeId,
            name,
            description,
            accountType,
            createdAt,
            updatedAt,
            deletedAt,
            transactions,
        );
    }
    public static create(
        name: string,
        description: string | null,
        accountType: AccountTypeEnum
    ){
        return new TransactionTypeEntity(
            BigInt(new Date().getDate()),
            name,
            description,
            accountType,
            new Date(),
            null,
            null,
            []
        );
    }

    get transactionTypeId(){
        return this._transactionTypeId;
    }
    get name(){
        return this._name.value;
    }
    get description(){
        return this._description.value;
    }
    get accountType(){
        return this._accountType;
    }
    get createdAt(){
        return this._createdAt;
    }
    get updatedAt(){
        return this._updatedAt;
    }
    get deletedAt(){
        return this._deletedAt;
    }
    get transactions(){
        return this._transactions;
    }

    public updateName(name: string){
        this._name = TransactionTypeNameVO.create(name);
        this._updatedAt = new Date()
    }
    public updateDescription(description: string| null){
        this._description = TransactionTypeDescriptionVO.create(description);
        this._updatedAt = new Date()
    }
    public updateAccountType(accountType: AccountTypeEnum){
        this._accountType = accountType;
        this._updatedAt = new Date()
    }
}