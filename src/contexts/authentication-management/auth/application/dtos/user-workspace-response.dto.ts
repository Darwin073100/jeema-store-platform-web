export interface UserWorkspaceResponseDTO {
  user: {
    userId: string;
    employeeId: string;
    username: string;
    email: string;
    roles: string[];
    permissions: string[];
  };
  employee?: {
    employeeId: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    branchOfficeId: string;
    employeeRoleId: string;
  };
  branchOffice: {
    branchOfficeId: string;
    name: string;
    address: {
      street: string;
      externalNumber: string;
      internalNumber?: string;
      city: string;
      state: string;
      country: string;
      municipality: string;
      neighborhood: string;
      postalCode: string;
    };
  };
  establishment: {
    establishmentId: string;
    name: string;
  };
}