import { ErrorEntity } from "@/shared/features/error.entity";
import { Result } from "@/shared/features/result";
import { CashRegisterEntity } from "../../domain/entities/cash-register.entity";
import { CashRepository } from "../../domain/repositories/cash.repository";
import { HttpClient } from "@/shared/infrastructure/http/http-client.interface";
import { ApiConfig } from "@/shared/infrastructure/config/api-config";
import { handleError } from "@/shared/infrastructure/http/handlers/handleError";
import { OpenCashSessionDTO } from "../../application/dtos/open-cash-session.dto";
import { CashMapper } from "../mappers/cash-mapper";
import { CashSessionEntity } from "../../domain/entities/cash-session.entity";
import { RegisterCashRegisterDTO } from "../../application/dtos/register-cash-register.dto";

export class CashFetchRepository implements CashRepository {
    constructor(
        private readonly httpClient: HttpClient,
        private readonly apiConfig: ApiConfig
    ){}

    async findAllCashRegisterByBranchOfficeId(branchOfficeId: bigint): Promise<Result<{ cashRegisters: CashRegisterEntity[]}, ErrorEntity>> {
        try {
            const result = await this.httpClient.get<{ cashRegisters: CashRegisterEntity[]}>(
                this.apiConfig.getEndpointUrl(`cash-registers/all/branch-offices/${branchOfficeId.toString()}`)
            );
            return Result.success(result.data);
        } catch (error) {
            return handleError(error, 'findAllCashRegisterByBranchOfficeId');
        }
    }
    async findCashSessionByEmployeeId(employeeId: bigint): Promise<Result<CashSessionEntity, ErrorEntity>> {
        try {
            const result = await this.httpClient.get<CashSessionEntity>(
                this.apiConfig.getEndpointUrl(`cash-registers/sessions/one/employees/${employeeId.toString()}`)
            );
            return Result.success(result.data);
        } catch (error) {
            return handleError(error, 'findCashSessionByEmployeeId');
        }
    }
    async openCashSession(dto: OpenCashSessionDTO): Promise<Result<CashSessionEntity, ErrorEntity>> {
        try {
            const httpDTO = CashMapper.toOpenCashSessionHttpDTO(dto);
            
            const result = await this.httpClient.post<CashSessionEntity>(
                this.apiConfig.getEndpointUrl(`cash-registers/${dto.cashRegisterId.toString()}/sessions`),
                httpDTO
            );
            return Result.success(result.data);
        } catch (error) {
            console.log(error);
            return handleError(error, 'openCashSession');
        }
    }
    async registerCashRegister(dto: RegisterCashRegisterDTO): Promise<Result<CashRegisterEntity, ErrorEntity>> {
        try {
            const httpDTO = CashMapper.toRegisterCashRegisterHttpDTO(dto);
            
            const result = await this.httpClient.post<CashRegisterEntity>(
                this.apiConfig.getEndpointUrl(`cash-registers`),
                httpDTO
            );
            return Result.success(result.data);
        } catch (error) {
            console.log(error);
            return handleError(error, 'registerCashRegister');
        }
    }
}