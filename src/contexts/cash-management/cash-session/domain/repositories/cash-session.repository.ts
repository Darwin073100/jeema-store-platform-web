import { TemplateRepository } from "src/shared/domain/repositories/template.repository";
import { CashSessionEntity } from "../entities/cash-session.entity";

export const CASH_SESSION_REPOSITORY = Symbol('CASH_SESSION_REPOSITORY');

export interface CashSessionRepository extends TemplateRepository<CashSessionEntity> {
    /**
     * Verifica el estado de la caja con el ID, 
     * si esta cerrada, devolvera { true }, 
     * si esta abierta o aperturada, devolvera { false }.
     * @param { bigint } cashRegisterId 
     * @returns { Promise<boolean> }
     */
    isClosedCashSession(cashRegisterId: bigint): Promise<CashSessionEntity|null>;
    findByEmployeeId(employeeId: bigint):Promise<CashSessionEntity | null>;
    findCashSessionWitTransactions(cashSessionId: bigint): Promise<CashSessionEntity|null>;
    findMovementsByBranchOffice(branchOfficeId: bigint): Promise<CashSessionEntity[]>;
    existById(entityId: bigint): Promise<CashSessionEntity | null>;
    findCashSessionTicket(cashSessionId: bigint): Promise<CashSessionEntity|null>;
    findAllByBranchOffice(branchOfficeId: bigint, dateInit: Date, dateFinish: Date): Promise<CashSessionEntity[]>;
}