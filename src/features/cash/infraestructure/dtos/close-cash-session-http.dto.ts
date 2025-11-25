export interface CloseCashSessionHttpDTO {
    employeeId: string;
    branchOfficeId: string;
    endTime: string;
    expectedBalance: number;
    actualBalance: number;
    diference: number;
    closingNotes?: string;
}