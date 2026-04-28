export interface SaleFilterDTO {
    branchOfficeId: bigint, 
    dateStart?: Date, 
    dateEnd?: Date, 
    search?:string
}