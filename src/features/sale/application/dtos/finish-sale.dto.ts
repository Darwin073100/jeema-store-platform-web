export interface FinishSaleDto {
    customerId: bigint;
    employeeId: bigint;
    notes?: string | null;
}