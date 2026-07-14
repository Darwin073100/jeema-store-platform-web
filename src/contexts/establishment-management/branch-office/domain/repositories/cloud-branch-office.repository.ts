import { Result } from "@/shared/lib/utils/result";
import { ICloudBranchOffice } from "../../presentation/interfaces/ICloudBranchOffice";
import { ErrorEntity } from "@/shared/lib/utils/error.entity";
import { RegisterCloudBranchAndCloudEstablishmentDTO } from "../../application/dtos/register-cloud-branch-and-cloud-establishment.dto";

export interface CloudBranchOfficeRepository {
    registerCloudBranchAndCloudEstablishment(dto: RegisterCloudBranchAndCloudEstablishmentDTO): Promise<Result<ICloudBranchOffice, ErrorEntity>> 
}