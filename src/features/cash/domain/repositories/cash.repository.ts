import { Result } from "@/shared/features/result";
import { CashRegisterEntity } from "../entities/cash-register.entity";
import { ErrorEntity } from "@/shared/features/error.entity";
import { CashSessionEntity } from "../entities/cash-session.entity";
import { OpenCashSessionDTO } from "../../application/dtos/open-cash-session.dto";
import { RegisterCashRegisterDTO } from "../../application/dtos/register-cash-register.dto";
import { CloseCashSessionDTO } from "../../application/dtos/close-cash-session.dto";

export interface CashRepository{
    findAllCashRegisterByBranchOfficeId(branchOfficeId: bigint):Promise<Result<{cashRegisters: CashRegisterEntity[]}, ErrorEntity>>;
    openCashSession(dto: OpenCashSessionDTO): Promise<Result<CashSessionEntity, ErrorEntity>>;
    registerCashRegister(dto: RegisterCashRegisterDTO): Promise<Result<CashRegisterEntity, ErrorEntity>>;
    findCashSessionByEmployeeId(employeeId: bigint): Promise<Result<CashSessionEntity, ErrorEntity>>;
    findCashSessionWithTransactions(cashSessionId: bigint): Promise<Result<CashSessionEntity, ErrorEntity>>;
    closeCashSession(cashSessionId: bigint, dto: CloseCashSessionDTO): Promise<Result<CashSessionEntity, ErrorEntity>>;
}