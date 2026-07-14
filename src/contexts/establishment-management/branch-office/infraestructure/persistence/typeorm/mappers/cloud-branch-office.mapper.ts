import { RegisterCloudBranchAndCloudEstablishmentDTO } from "@/contexts/establishment-management/branch-office/application/dtos/register-cloud-branch-and-cloud-establishment.dto";

export class CloudBranchOfficeMapper {
    static toRegisterCloudBranchAndCloudEstablishmentHttp(dto: RegisterCloudBranchAndCloudEstablishmentDTO){
        return {
            localBranchOfficeId: dto.localBranchOfficeId.toString(),
            branchOfficeName: dto.branchOfficeName.toString(),
            establishmentName: dto.establishmentName.toString(),
            enrollmentKey: dto.enrollmentKey.toString()
        }
    }
}