import { IEmployee } from "@/contexts/employee-management/employee/presentation/interfaces/IEmployee";
import { IBranchOffice } from "@/contexts/establishment-management/branch-office/presentation/interfaces/IBranchOffice";
import { IEstablishment } from "@/contexts/establishment-management/establishment/presentation/interfaces/IEstablishment";
import { IUser } from "../../presentation/interfaces/IUser";

export interface IUserWorkspace {
  user: IUser;
  employee: IEmployee | null;
  branchOffice: IBranchOffice | null;
  establishment: IEstablishment | null;
}