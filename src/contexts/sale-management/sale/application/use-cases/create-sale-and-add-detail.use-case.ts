import { SaleRepository } from "../../domain/repositories/sale.repository";
import { RegisterSaleDto } from "../dtos/register-sale.dto";
import { SaleEntity } from "../../domain/entities/sale.entity";
import { SaleConflictException } from "../../domain/exceptions/sale-conflict.exception";
import { AddDetailToSaleDto } from "@/contexts/sale-management/sale-detail/application/dtos/add-detail-to-sale.dto";
import { RegisterSaleUseCase } from "./register-sale.use-case";
import { RegisterSaleDetailUseCase } from "@/contexts/sale-management/sale-detail/application/use-case/register-sale-detail.use-case";

export class CreateSaleAndAddDetailUseCase {
    constructor(
        private readonly repository: SaleRepository,
        private readonly registerSaleUseCase: RegisterSaleUseCase,
        private readonly registerSaleDetailUseCase: RegisterSaleDetailUseCase,
    ) { }

    async execute(saveSaleDTO: RegisterSaleDto, addDetailDTO: AddDetailToSaleDto) {
        if (addDetailDTO.productBarCodeAtSale === '') {
            throw new SaleConflictException('Hubo un error al agregar el producto a la venta.');
        }
        if (addDetailDTO.quantity <= 0) {
            throw new SaleConflictException('No puedes agregar 0 o menos de 0 productos a la venta.');
        }
        if (saveSaleDTO.branchOfficeId === BigInt(0) && saveSaleDTO.employeeId === BigInt(0) && saveSaleDTO.customerId === BigInt(0)) {
            throw new SaleConflictException('Hubo un error al agregar el producto a la venta.');
        }
        if (saveSaleDTO.customerId === BigInt(0)) {
            throw new SaleConflictException('Asegurate de tener creado el cliente por defecto(Publico en General)');
        }

        let sale: SaleEntity | null;
        // Verificar si hay una venta con ese ID
        sale = await this.repository.findById(addDetailDTO.saleId);
        // Si no hay una venta con ese ID, se crea una nueva venta.
        if (!sale) {
            sale = await this.registerSaleUseCase.execute(saveSaleDTO);
        }

        // Agrega un detalle de venta a la venta
        const addResult = await this.registerSaleDetailUseCase.execute({
            ...addDetailDTO,
            saleId: sale.saleId
        });
        // Verificar si no hubo un error a la hora de agregar un detalle de venta.
        if (!addResult) {
            throw new SaleConflictException('Hubo un error al agregar el producto ala venta.');
        }

        // Realizar una consulta para ver todos los detalles de venta.
        const findSaleWithDetails = await this.repository.findById(sale.saleId);
        return findSaleWithDetails ?? sale;
    }
}