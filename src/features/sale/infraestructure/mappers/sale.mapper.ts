import { AddDetailToSaleDto } from "../../application/dtos/add-detail-to-sale.dto";
import { FinalizeSaleDto } from "../../application/dtos/finalize-sale.dto";
import { FinishSaleDto } from "../../application/dtos/finish-sale.dto";
import { RegisterSalePaymentDto } from "../../application/dtos/register-sale-payment.dto";
import { RegisterSaleDto } from "../../application/dtos/register-sale.dto";
import { AddDetailToSaleHttpDto } from "../dtos/add-detail-to-sale-http.dto";
import { FinalizeSaleHttpDto } from "../dtos/finalize-sale-http.dto";
import { FinishSaleHttpDto } from "../dtos/finish-sale-http.dto";
import { RegisterSaleHttpDto } from "../dtos/register-sale-http.dto";
import { RegisterSalePaymentHttpDto, RegisterSalePaymentItemHttp } from "../dtos/register-sale-payment-http.dto";

export class SaleMapper {
    static toHttpRegisterSaleDTO(dto: RegisterSaleDto){
        const httpDTO: RegisterSaleHttpDto = {
            branchOfficeId: dto.branchOfficeId.toString(),
            customerId: dto.customerId.toString(),
            employeeId: dto.employeeId.toString(),
        }
        return httpDTO;
    }

    static toHttpAddDetailToSaleDTO(dto: AddDetailToSaleDto){
        const httpDTO: AddDetailToSaleHttpDto = {
            productBarCodeAtSale: dto.productBarCodeAtSale,
            productUnitAtSale: dto.productUnitAtSale,
            quantity: Number(dto.quantity),
            unitPriceAtSale: Number(dto.unitPriceAtSale),
            notes: dto.notes
        }

        return httpDTO;
    }

    static toHttpFinishSale(dto: FinishSaleDto){
        const httpDTO: FinishSaleHttpDto = {
            customerId: dto.customerId.toString(),
            employeeId: dto.employeeId.toString(),
            notes: dto.notes
        }

        return httpDTO;
    }

    static toHttpFinalizeSale(dto: FinalizeSaleDto){
        const httpDTO: FinalizeSaleHttpDto = {
            customerId: dto.customerId.toString(),
            employeeId: dto.employeeId.toString(),
            status: dto.status,
            notes: dto.notes
        }

        return httpDTO;
    }

    static toHttpRegisterSalePaymentDTO(dto: RegisterSalePaymentDto){
        const httpDto: RegisterSalePaymentHttpDto = {
            methods: dto.methods.map( item => {
                const itemHttpDto: RegisterSalePaymentItemHttp = {
                    amountPaid: item.amountPaid,
                    paymentMethodId: item.paymentMethodId.toString(),
                    referenceNumber: item.referenceNumber
                }
                return itemHttpDto;
            })
        }
        return httpDto;
    }
}