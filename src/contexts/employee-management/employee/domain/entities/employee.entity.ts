import { DomainEvent } from "src/shared/domain/events/domain-events";
import { EmployeeFirstNameVO } from "../values-objects/employee-first-name.vo";
import { EmployeeRoleEntity } from "src/contexts/employee-management/employee-role/domain/entities/employee-role.entity";
import { EmployeeLastNameVO } from "../values-objects/employee-last-name.vo";
import { EmployeeEmailVO } from "../values-objects/employee-email.vo";
import { EmployeePhoneNumberVO } from "../values-objects/employee-phone-number.vo";
import { EmployeeBirthDateVO } from "../values-objects/employee-birth-date.vo";
import { GenderEnum } from "../enums/gender.enum";
import { EmployeeHireDateVO } from "../values-objects/employee-hire-date.vo";
import { EmployeeTerminationDateVO } from "../values-objects/employee-termination-date.vo";
import { BranchOfficeEntity } from "src/contexts/establishment-management/branch-office/domain/entities/branch-office.entity";
import { EmployeeCurrentSalaryVO } from "../values-objects/employee-current-salary.vo";
import { SaleEntity } from "src/contexts/sale-management/sale/domain/entities/sale.entity";
import { TransactionEntity } from "src/contexts/transaction-management/transaction/domain/entities/transaction.entity";
import { UserEntity } from "src/contexts/authentication-management/auth/domain/entities/user.entity";
import { CashSessionEntity } from "src/contexts/cash-management/cash-session/domain/entities/cash-session.entity";
import { ReturnsEntity } from "src/contexts/sale-management/returns/domain/entities/returns.entity";
import { AddressEntity } from "@/contexts/establishment-management/address/domain/entities/address.entity";

export class EmployeeEntity {
    private readonly _employeeId: bigint;
    private _employeeRoleId: bigint;
    private _branchOfficeId: bigint;
    private _addressId: bigint|null;
    private _firstName: EmployeeFirstNameVO;
    private _lastName: EmployeeLastNameVO;
    private _email: EmployeeEmailVO;
    private _phoneNumber: EmployeePhoneNumberVO;
    private _birthDate: EmployeeBirthDateVO;
    private _gender: GenderEnum|null;
    private _hireDate: EmployeeHireDateVO;
    private _terminationDate: EmployeeTerminationDateVO;
    private _entryTime: string|null;
    private _exitTime: string|null;
    private _isActive: boolean;
    private _photoUrl: string|null;
    private _currentSalary: EmployeeCurrentSalaryVO;
    private readonly _createdAt: Date;
    private _updatedAt: Date | null;
    private _deletedAt: Date | null;
    private _employeeRole: EmployeeRoleEntity|null;
    private _branchOffice: BranchOfficeEntity|null;
    private _address: AddressEntity|null;
    private _sales: SaleEntity[]|null;
    private _transactions: TransactionEntity[]|null;
    private _user: UserEntity|null;
    private _cashSessions: CashSessionEntity[]|null;
    private _returns: ReturnsEntity[] | null;

    private constructor(
    employeeId: bigint,
    employeeRoleId: bigint,
    branchOfficeId: bigint,
    addressId: bigint|null,
    firstName: EmployeeFirstNameVO,
    lastName: EmployeeLastNameVO,
    phoneNumber: EmployeePhoneNumberVO,
    email: EmployeeEmailVO,
    birthDate: EmployeeBirthDateVO,
    gender: GenderEnum|null,
    hireDate: EmployeeHireDateVO,
    terminationDate: EmployeeTerminationDateVO,
    entryTime: string|null,
    exitTime: string|null,
    isActive: boolean,
    photoUrl: string | null,
    currentSalary: EmployeeCurrentSalaryVO,
    createdAt: Date,
    updatedAt: Date | null,
    deletedAt: Date | null,
    employeeRole: EmployeeRoleEntity | null,
    branchOffice: BranchOfficeEntity|null,
    address: AddressEntity|null,
    user: UserEntity | null,
    sales: SaleEntity[] | null,
    transactions: TransactionEntity[] | null,
    cashSessions: CashSessionEntity[] | null,
    returns: ReturnsEntity[] | null
    ) {
        this._employeeId = employeeId;
        this._employeeRoleId = employeeRoleId;
        this._addressId = addressId;
        this._branchOfficeId = branchOfficeId;
        this._firstName = firstName;
        this._lastName = lastName;
        this._email = email;
        this._phoneNumber = phoneNumber;
        this._birthDate = birthDate;
        this._gender = gender;
        this._hireDate = hireDate;
        this._terminationDate = terminationDate;
        this._entryTime = entryTime;
        this._exitTime = exitTime;
        this._isActive = isActive;
        this._photoUrl = photoUrl;
        this._currentSalary = currentSalary;
        this._createdAt = createdAt;
        this._updatedAt = updatedAt;
        this._deletedAt = deletedAt;
        this._branchOffice = branchOffice;
        this._address = address;
        this._employeeRole = employeeRole;
        this._sales = sales;
        this._transactions = transactions;
        this._user = user;
        this._cashSessions = cashSessions;
        this._returns = returns;
    }

    /**
     * Crea una nueva instancia de EmployeeEntity.
     * Este es un método de fábrica para asegurar la creación controlada del agregado.
     * Un evento de dominio EmployeeRoleCreatedEvent se registra internamente.
     *
     * @returns Una nueva instancia de EmployeeEntity.
     */
    static create(
        employeeRoleId: bigint,
        branchOfficeId: bigint,
        addressId: bigint | null,
        firstName: string,
        lastName: string,
        phoneNumber: string | null,
        email: string | null,
        birthDate: Date | null,
        gender: GenderEnum | null,
        hireDate: Date | null,
        terminationDate: Date | null,
        entryTime: string | null,
        exitTime: string | null,
        photoUrl: string | null,
        currentSalary: number | null
    ): EmployeeEntity {
        const employee = new EmployeeEntity(
            BigInt(0),
            employeeRoleId,
            branchOfficeId,
            addressId,
            EmployeeFirstNameVO.create(firstName),
            EmployeeLastNameVO.create(lastName),
            EmployeePhoneNumberVO.create(phoneNumber),
            EmployeeEmailVO.create(email),
            EmployeeBirthDateVO.create(birthDate),
            gender,
            EmployeeHireDateVO.create(hireDate),
            EmployeeTerminationDateVO.create(terminationDate),
            entryTime,
            exitTime,
            true,
            photoUrl,
            EmployeeCurrentSalaryVO.create(currentSalary),
            new Date(),
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null
        );
        // Registrar evento de dominio si aplica (ejemplo: EmployeeCreatedEvent)
        // employee.recordEvent(new EmployeeCreatedEvent(employee));
        return employee;
    }

    /**
     * Reconstituye una instancia de EmployeeEntity desde la persistencia.
     * No emite eventos ya que representa un estado ya existente.
     */
    static reconstitute(
        employeeId: bigint,
        employeeRoleId: bigint,
        branchOfficeId: bigint,
        addressId: bigint | null,
        firstName: string,
        lastName: string,
        phoneNumber: string | null,
        email: string | null,
        birthDate: Date | null,
        gender: GenderEnum | null,
        hireDate: Date | null,
        terminationDate: Date | null,
        entryTime: string | null,
        exitTime: string | null,
        isActive: boolean,
        photoUrl: string | null,
        currentSalary: number | null,
        createdAt: Date,
        updatedAt: Date | null,
        deletedAt: Date | null,
        employeeRole: EmployeeRoleEntity | null,
        branchOffice: BranchOfficeEntity | null,
        address: AddressEntity | null,
        user: UserEntity | null,
        sales: SaleEntity[] | null,
        transactions: TransactionEntity[] | null,
        cashSessions: CashSessionEntity[] | null,
        returns: ReturnsEntity[] | null,
    ): EmployeeEntity {
        return new EmployeeEntity(
            employeeId,
            employeeRoleId,
            branchOfficeId,
            addressId,
            EmployeeFirstNameVO.create(firstName),
            EmployeeLastNameVO.create(lastName),
            EmployeePhoneNumberVO.create(phoneNumber),
            EmployeeEmailVO.create(email),
            EmployeeBirthDateVO.create(birthDate),
            gender,
            EmployeeHireDateVO.create(hireDate),
            EmployeeTerminationDateVO.create(terminationDate),
            entryTime,
            exitTime,
            isActive,
            photoUrl,
            EmployeeCurrentSalaryVO.create(currentSalary),
            createdAt,
            updatedAt,
            deletedAt,
            employeeRole,
            branchOffice,
            address,
            user,
            sales,
            transactions,
            cashSessions,
            returns,
        );
    }

    // Getters
    get employeeId() {
        return this._employeeId;
    }
    get employeeRoleId() {
        return this._employeeRoleId;
    }
    get branchOfficeId() {
        return this._branchOfficeId;
    }
    get addressId() {
        return this._addressId;
    }
    get firstName() {
        return this._firstName.value;
    }
    get lastName() {
        return this._lastName.value;
    }
    get email() {
        return this._email.value;
    }
    get phoneNumber() {
        return this._phoneNumber.value;
    }
    get birthDate() {
        return this._birthDate.value;
    }
    get gender() {
        return this._gender;
    }
    get hireDate() {
        return this._hireDate.value;
    }
    get terminationDate() {
        return this._terminationDate.value;
    }
    get entryTime() {
        return this._entryTime;
    }
    get exitTime() {
        return this._exitTime;
    }
    get isActive() {
        return this._isActive;
    }
    get photoUrl() {
        return this._photoUrl;
    }
    get employeeRole() {
        return this._employeeRole;
    }
    get branchOffice() {
        return this._branchOffice;
    }
    get address() {
        return this._address;
    }
    get currentSalary() {
        return this._currentSalary.value;
    }
    get createdAt() {
        return this._createdAt;
    }
    get updatedAt() {
        return this._updatedAt;
    }
    get deletedAt() {
        return this._deletedAt;
    }
    get sales() {
        return this._sales;
    }
    get transactions(){
        return this._transactions;
    }
    get user(){
        return this._user;
    }
    get cashSessions(){
        return this._cashSessions;
    }
    get returns(){ return this._returns;}


    public updateEmployeeRoleId(employeeRoleId: bigint): void {
        this._employeeRoleId = employeeRoleId;
    }
    public updateBranchOfficeId(branchOfficeId: bigint): void {
        this._branchOfficeId = branchOfficeId;
    }
    public updateAddressId(addressId: bigint | null): void {
        this._addressId = addressId;
    }
    public updateAddress(address: AddressEntity |null): void {
        this._address = address;
    }
    public updateFirstName(name: string): void {
        this._firstName = EmployeeFirstNameVO.create(name);
    }
    public updateLastName(lastName: string): void {
        this._lastName = EmployeeLastNameVO.create(lastName);
    }
    public updateEmail(email: string | null): void {
        this._email = EmployeeEmailVO.create(email);
    }
    public updatePhoneNumber(phoneNumber: string): void {
        this._phoneNumber = EmployeePhoneNumberVO.create(phoneNumber);
    }
    public updateBirthDate(birthDate: Date | null): void {
        this._birthDate = EmployeeBirthDateVO.create(birthDate);
    }
    public updateGender(gender: GenderEnum | null): void {
        this._gender = gender;
    }
    public updateHireDate(hireDate: Date | null): void {
        this._hireDate = EmployeeHireDateVO.create(hireDate);
    }
    public updateTerminationDate(terminationDate: Date | null): void {
        this._terminationDate = EmployeeTerminationDateVO.create(terminationDate);
    }
    public updateEntryTime(entryTime: string | null): void {
        this._entryTime = entryTime;
    }
    public updateExitTime(exitTime: string | null): void {
        this._exitTime = exitTime;
    }
    public updateIsActive(isActive: boolean) {
        this._isActive = isActive;
    }
    public updatePhotoUrl(photoUrl: string | null): void {
        this._photoUrl = photoUrl;
    }
    public updateCurrentSalary(currentSalary: number | null): void {
        this._currentSalary = EmployeeCurrentSalaryVO.create(currentSalary);
    }
}

