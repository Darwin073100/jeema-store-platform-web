export interface UserProfileResponse {
  user: {
    userId: bigint;
    employeeId: bigint;
    username: string;
    email: string;
    roles: string[];
    permissions: string[];
  };
  employee?: {
    employeeId: bigint;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    branchOfficeId: bigint;
    employeeRoleId: bigint;
  };
}