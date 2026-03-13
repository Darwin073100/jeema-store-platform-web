export class UpdateBranchOfficeDto {
    readonly name: string | null;
    readonly branchOfficeId: bigint;
    constructor(
      name: string | null,
      branchOfficeId: bigint,
    ){
      this.branchOfficeId = branchOfficeId;
      this.name = name;
    }
  }