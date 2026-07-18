import { RegisterCloudBranchAndCloudEstablishmentDto } from "@/contexts/establishment-management/branch-office/application/dtos/register-cloud-branch-and-cloud-establishment.dto";
import { RegisterCloudBranchDto } from "@/contexts/establishment-management/branch-office/application/dtos/register-cloud-branch.dto";

export class CloudBranchOfficeMapper {
    static toRegisterCloudBranchAndCloudEstablishmentHttp(dto: RegisterCloudBranchAndCloudEstablishmentDto){
        return {
            localBranchOfficeId: dto.branchOfficeId.toString(),
            branchOfficeName: dto.branchOfficeName.toString(),
            establishmentName: dto.establishmentName.toString(),
            enrollmentKey: dto.enrollmentKey.toString()
        }
    }

    static toRegisterCloudBranchHttp(dto: RegisterCloudBranchDto){
        return {
            localBranchOfficeId: dto.branchOfficeId.toString(),
            branchOfficeName: dto.branchOfficeName.toString(),
            enrollmentKey: dto.enrollmentKey.toString()
        }
    }
}