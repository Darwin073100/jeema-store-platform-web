import { BranchOfficeEntity } from "src/contexts/establishment-management/branch-office/domain/entities/branch-office.entity";
import { CashRegisterNameVO } from "../value-objets/cash-register-name.vo";
import { CashSessionEntity } from "src/contexts/cash-management/cash-session/domain/entities/cash-session.entity";
import { PrinterConfigurationEntity } from "src/contexts/configuration-management/printer-configuration/domain/entities/printer-configuration.entity";

export class CashRegisterEntity {
    private readonly _cashRegisterId: bigint;
    private _branchOfficeId: bigint;
    private _name: CashRegisterNameVO;
    private _isActive: boolean;
    private readonly _createdAt: Date;
    private _updatedAt: Date | null;
    private _deletedAt: Date | null;
    private _branchOffice: BranchOfficeEntity | null;
    private _cashSessions: CashSessionEntity[] | null;
    private _printerConfiguration: PrinterConfigurationEntity | null;

    private constructor(
        cashRegisterId: bigint,
        branchOfficeId: bigint,
        name: CashRegisterNameVO,
        isActive: boolean,
        createdAt: Date,
        updatedAt: Date | null,
        deletedAt: Date | null,
        branchOffice: BranchOfficeEntity | null,
        cashSessions: CashSessionEntity[] | null,
        printerConfiguration: PrinterConfigurationEntity | null = null,
    ){
        this._cashRegisterId = cashRegisterId;
        this._branchOfficeId = branchOfficeId;
        this._name = name;
        this._isActive = isActive;
        this._createdAt = createdAt;
        this._updatedAt = updatedAt;
        this._deletedAt = deletedAt;
        this._branchOffice = branchOffice;
        this._cashSessions = cashSessions;
        this._printerConfiguration = printerConfiguration;
    }

    public static create(
        branchOfficeId: bigint,
        name: string,
    ){
        return new CashRegisterEntity(
            BigInt(0),
            branchOfficeId,
            CashRegisterNameVO.create(name),
            true,
            new Date(),
            null,
            null,
            null,
            null,
            null,
        );
    }
    public static reconstitute(
        cashRegisterId: bigint,
        branchOfficeId: bigint,
        name: string,
        isActive: boolean,
        createdAt: Date,
        updatedAt: Date | null,
        deletedAt: Date | null,
        branchOffice: BranchOfficeEntity | null,
        cashSessions: CashSessionEntity[] | null,
        printerConfiguration: PrinterConfigurationEntity | null = null,
    ){
        return new CashRegisterEntity(
            cashRegisterId,
            branchOfficeId,
            CashRegisterNameVO.create(name),
            isActive,
            createdAt,
            updatedAt,
            deletedAt,
            branchOffice,
            cashSessions,
            printerConfiguration,
        );
    }

    get cashRegisterId(){
        return this._cashRegisterId;
    }
    get branchOfficeId(){
        return this._branchOfficeId;
    }
    get name(){
        return this._name.value;
    }
    get isActive(){
        return this._isActive;
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
    get branchOffice(){
        return this._branchOffice;
    }
    get cashSessions(){
        return this._cashSessions;
    }
    get printerConfiguration(){
        return this._printerConfiguration;
    }

    public updateName(name: string){
        this._name = CashRegisterNameVO.create(name);
        this._updatedAt = new Date();
    }
    
    public updateIsActive(isActive: boolean){
        this._isActive = isActive;
        this._updatedAt = new Date();
    }
}