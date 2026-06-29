export interface CloseCashSessionDTO {
    finallyCloseAmount: number;
    employeeId: bigint;
    branchOfficeId: bigint;
    endTime: Date;
    expectedBalance: number;
    actualBalance: number;
    diference: number;
    closingNotes: string | null;
}