export class RegisterSaleDto {
  readonly branchOfficeId: bigint;
  readonly customerId: bigint;
  readonly employeeId: bigint;
  readonly cashRegisterId: bigint;

  constructor(
    branchOfficeId: bigint,
    customerId: bigint,
    employeeId: bigint,
    cashRegisterId: bigint,
  ) {
    this.branchOfficeId = branchOfficeId;
    this.customerId = customerId;
    this.employeeId = employeeId;
    this.cashRegisterId = cashRegisterId;
    Object.freeze(this);
  }
}
