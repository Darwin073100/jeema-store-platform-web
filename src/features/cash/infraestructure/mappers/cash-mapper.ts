import { CloseCashSessionDTO } from "../../application/dtos/close-cash-session.dto";
import { OpenCashSessionDTO } from "../../application/dtos/open-cash-session.dto";
import { RegisterCashRegisterDTO } from "../../application/dtos/register-cash-register.dto";
import { CloseCashSessionHttpDTO } from "../dtos/close-cash-session-http.dto";
import { OpenCashSessionHttpDTO } from "../dtos/open-cash-session-http.dto";
import { RegisterCashRegisterHttpDTO } from "../dtos/register-cash-register-http.dto";
export class CashMapper {
    static toOpenCashSessionHttpDTO(dto: OpenCashSessionDTO){
        const httpDTO: OpenCashSessionHttpDTO = {
            branchOfficeId: dto.branchOfficeId.toString(),
            employeeId: dto.employeeId.toString(),
            startTime: dto.startTime.toISOString(),
            startBalance: dto.startBalance,
        }
        return httpDTO;
    }

    static toCloseCashSessionHttpDTO(dto: CloseCashSessionDTO){
        const httpDTO: CloseCashSessionHttpDTO = {
            branchOfficeId: dto.branchOfficeId.toString(),
            employeeId: dto.employeeId.toString(),
            actualBalance: dto.actualBalance,
            diference: dto.diference,
            endTime: dto.endTime.toISOString(),
            expectedBalance: dto.expectedBalance,
            closingNotes: dto.closingNotes && (dto.closingNotes.trim().length > 0) ? dto.closingNotes :undefined
        }
        return httpDTO;
    }

    static toRegisterCashRegisterHttpDTO(dto: RegisterCashRegisterDTO){
        const httpDTO: RegisterCashRegisterHttpDTO = {
            branchOfficeId: dto.branchOfficeId.toString(),
            name: dto.name
        }
        return httpDTO;
    }
}