export const BRANCH_OFFICE_CHECKER_PORT = Symbol('BRANCH_OFFICE_CHECKER_PORT');
export interface BranchOfficeCheckerPort {
  existById(branchOfficeId: bigint): Promise<boolean>;
}