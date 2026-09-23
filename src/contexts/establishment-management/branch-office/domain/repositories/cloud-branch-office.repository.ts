import { Result } from "@/shared/lib/utils/result";
import { ICloudBranchOffice } from "../../presentation/interfaces/ICloudBranchOffice";
import { ErrorEntity } from "@/shared/lib/utils/error.entity";
import { RegisterCloudBranchAndCloudEstablishmentDto } from "../../application/dtos/register-cloud-branch-and-cloud-establishment.dto";
import { RegisterCloudBranchDto } from "../../application/dtos/register-cloud-branch.dto";

export interface CloudBranchOfficeRepository {
    registerCloudBranchAndCloudEstablishment(dto: RegisterCloudBranchAndCloudEstablishmentDto): Promise<Result<ICloudBranchOffice, ErrorEntity>>;
    registerCloudBranch(dto: RegisterCloudBranchDto): Promise<Result<ICloudBranchOffice, ErrorEntity>>;
    /** Directorio de sucursales inscritas con la misma clave (usado para elegir destino de un traspaso). */
    findAllByEnrollmentKey(enrollmentKey: string): Promise<Result<ICloudBranchOffice[], ErrorEntity>>;
}