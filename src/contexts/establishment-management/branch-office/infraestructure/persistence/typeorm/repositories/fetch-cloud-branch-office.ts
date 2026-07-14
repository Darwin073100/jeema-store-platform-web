import { RegisterCloudBranchAndCloudEstablishmentDTO } from "@/contexts/establishment-management/branch-office/application/dtos/register-cloud-branch-and-cloud-establishment.dto";
import { CloudBranchOfficeRepository } from "@/contexts/establishment-management/branch-office/domain/repositories/cloud-branch-office.repository";
import { ICloudBranchOffice } from "@/contexts/establishment-management/branch-office/presentation/interfaces/ICloudBranchOffice";
import { ApiConfig } from "@/shared/domain/repositories/api-config";
import { ApiCloudTransferConfigImpl } from "@/shared/infrastructure/config/api-cloud-transfer.config";
import { FetchHttpClient } from "@/shared/infrastructure/http/fetch-http-client.impl";
import { handleError } from "@/shared/infrastructure/http/handlers/handleError";
import { HttpClient } from "@/shared/infrastructure/http/http-client.interface";
import { ErrorEntity } from "@/shared/lib/utils/error.entity";
import { Result } from "@/shared/lib/utils/result";
import { CloudBranchOfficeMapper } from "../mappers/cloud-branch-office.mapper";

export class FetchCloudBranchOffice implements CloudBranchOfficeRepository {
    private constructor(
        private readonly apiConfig: ApiConfig,
        private readonly httpClient: HttpClient
    ) { }

    // Metodo factory para crear la instancia de esta clase. 
    public static create() {
        const http = new FetchHttpClient()
        const transfer = new ApiCloudTransferConfigImpl();
        return new FetchCloudBranchOffice(transfer, http);
    }

    async registerCloudBranchAndCloudEstablishment(dto: RegisterCloudBranchAndCloudEstablishmentDTO): Promise<Result<ICloudBranchOffice, ErrorEntity>> {
        try {
            const httpBody = CloudBranchOfficeMapper.toRegisterCloudBranchAndCloudEstablishmentHttp(dto);
            const response = await this.httpClient.post<ICloudBranchOffice>(
                `${this.apiConfig.baseUrl}/cloud-branch-offices`,
                httpBody
            );

            return Result.success(response.data);
        } catch (error) {
            return handleError(error, 'generateEnrollmentKey');
        }
    }
}