import { EstablishmentNameVO } from "src/contexts/establishment-management/establishment/domain/values-objects/establishment-name.vo";
import { BranchOfficeNameVO } from "../value-objects/branch-office-name.vo";
import { EmployeeEntity } from '../../../../employee-management/employee/domain/entities/employee.entity';
import { EstablishmentEntity } from "src/contexts/establishment-management/establishment/domain/entities/establishment.entity";
import { SaleEntity } from "src/contexts/sale-management/sale/domain/entities/sale.entity";
import { TransactionEntity } from "src/contexts/transaction-management/transaction/domain/entities/transaction.entity";
import { AddressEntity } from "src/shared/domain/entities/address.entity";
import { CashRegisterEntity } from "src/contexts/cash-management/cash-register/domain/entities/cash-register.entity";
  
  /**
   * BranchOffice es una Entidad Raíz de Agregado.
   * Es el punto de consistencia transaccional para la sucursal y su dirección.
   * Contiene la identidad de la sucursal y encapsula la lógica de negocio.
   */
  export class BranchOfficeEntity {
    private readonly _branchId: bigint;
    private _name: BranchOfficeNameVO;
    private _addressId: bigint;
    private _establishmentId: bigint; // ID del Establishment al que pertenece
    private readonly _createdAt: Date;
    private _updatedAt: Date | null;
    private _deletedAt: Date | null;
    private _address: AddressEntity; // La dirección es parte de la sucursal
    private _establishment: EstablishmentEntity | null;
    private _employees: EmployeeEntity[] | null;
    private _sales: SaleEntity[] | null;
    private _transactions: TransactionEntity[] | null;
    private _cashRegister: CashRegisterEntity[] | null;
    // El constructor es privado para forzar el uso de métodos de fábrica para la creación.
    // Esto asegura que la entidad solo se cree en un estado válido.
    private constructor(
      branchOfficeId: bigint,
      establishmentId: bigint,
      addressId: bigint,
      name: BranchOfficeNameVO,
      address: AddressEntity,
      createdAt: Date,
      updatedAt: Date | null,
      deletedAt: Date | null,
      establishment: EstablishmentEntity | null,
      sales: SaleEntity[] | null,
      transactions: TransactionEntity[] | null,
      employees: EmployeeEntity[] | null,
      cashRegister: CashRegisterEntity[] | null,
    ) {
        this._branchId = branchOfficeId;
        this._addressId = addressId;
        this._name = name;
        this._address = address;
        this._establishmentId = establishmentId;
        this._createdAt = createdAt;
        this._updatedAt = updatedAt;
        this._deletedAt = deletedAt;
        this._employees = employees;
        this._establishment = establishment;
        this._sales = sales;
        this._transactions = transactions;
        this._cashRegister = cashRegister;
    }
  
    get branchOfficeId(): bigint { return this._branchId; }
    get addressId(): bigint { return this._addressId; }
    get name(): string { return this._name.value; }
    get address(): AddressEntity { return this._address; }
    get establishmentId(): bigint { return this._establishmentId; }
    get establishment(): EstablishmentEntity | null{ return this._establishment; }
    get createdAt(): Date { return this._createdAt; }
    get updatedAt(): Date | null { return this._updatedAt; }
    get deletedAt(): Date | null{ return this._deletedAt; }
    get employees(): EmployeeEntity[] | null { return this._employees; }
    get sales(): SaleEntity[] | null{ return this._sales; }
    get transactions(): TransactionEntity[] | null{ return this._transactions; }
    get cashRegister(): CashRegisterEntity[] | null{ return this._cashRegister; }
  
    public static create(
      name: string,
      address: AddressEntity,
      establishmentId: bigint,
    ): BranchOfficeEntity {
      const branchOffice = new BranchOfficeEntity(
        BigInt(0),
        establishmentId,
        address.addressId,
        EstablishmentNameVO.create(name),
        address,
        new Date(),
        null,
        null,
        null,
        null,
        null,
        null,
        null,
      );
      return branchOffice;
    }
  
    public static reconstitute(
      branchOfficeId: bigint,
      establishmentId: bigint,
      addressId: bigint,
      name: string,
      address: AddressEntity,
      createdAt: Date,
      updatedAt: Date | null,
      deletedAt: Date | null,
      establishment: EstablishmentEntity | null,
      sales: SaleEntity[] | null,
      transactions: TransactionEntity[] | null,
      employees: EmployeeEntity[] | null,
      cashRegister: CashRegisterEntity[] | null,
    ): BranchOfficeEntity {
      return new BranchOfficeEntity(
        branchOfficeId,
        establishmentId,
        addressId,
        BranchOfficeNameVO.create(name),
        address,
        createdAt,
        updatedAt,
        deletedAt,
        establishment,
        sales,
        transactions,
        employees,
        cashRegister,
      );
    }

    public updateName(name: string){
      this._name = BranchOfficeNameVO.create(name);
      this._updatedAt = new Date();
    }    
  }