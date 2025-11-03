import { Result } from "@/shared/features/result";
import { SaleRepository } from "../../domain/repositories/sale.repository";
import { FinishSaleDto } from "../dtos/finish-sale.dto";
import { FloatMessageType } from "@/shared/ui/types/FloatMessageType";
import { FinalizeSaleDto } from "../dtos/finalize-sale.dto";
import { SaleStatusEnum } from "../../domain/enums/sale-status.enum";

export class FinishSaleUseCase {
    constructor(
        private readonly repository: SaleRepository
    ){}

    async execute(saleId: bigint, dto: FinishSaleDto){
        const newDTO: FinalizeSaleDto = {
            customerId: dto.customerId,
            employeeId: dto.employeeId,
            status: SaleStatusEnum.COMPLETED, // Finished
            notes: dto.notes
        }
        const customerIdvalid = dto.customerId <= BigInt(0);
        if(customerIdvalid){
            return Result.failure<FloatMessageType>({
                summary: '404: Elige un cliente',
                description: 'Debes elegir un cliente',
                isActive: true,
                type: 'red'
            })
        }
        const employeeIdvalid = dto.employeeId <= BigInt(0);
        const saleIdValid = saleId <= BigInt(0);

        if(employeeIdvalid || saleIdValid){
            return Result.failure<FloatMessageType>({
                summary: '500: Error al finalizar la venta',
                description: 'Ha ocurrido un error a la hora de finalizar la venta',
                isActive: true,
                type: 'red'
            })
        }
        const result = await this.repository.finalizeSale(saleId, newDTO);
        if(result.ok){
            return Result.success<FloatMessageType>({
                isActive: true,
                type: 'green',
                summary: '¡Venta finalizada!',
                description: 'Se ha finalizado la venta.'
            });
        } else {
            return Result.failure<FloatMessageType>({
                summary: `${result.error?.statusCode}: Error al finalizar la venta`,
                description: result.error?.message ?? 'Ha ocurrido un error al finalizar la venta',
                isActive: true,
                type: 'red'
            });
        }
    }
}