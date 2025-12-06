import { ErrorEntity } from "@/shared/features/error.entity";
import { SaleRepository } from "../../domain/repositories/sale.repository";
import { AddDetailToSaleDto } from "../dtos/add-detail-to-sale.dto";
import { RegisterSaleDto } from "../dtos/register-sale.dto";
import { SaleEntity } from "../../domain/entities/sale-entity";
import { Result } from "@/shared/features/result";

export class CreateSaleAndAddDetailUseCase {
    constructor(
        private readonly repository: SaleRepository
    ) { }

    async execute(saleId: bigint, saveSaleDTO: RegisterSaleDto, addDetailDTO: AddDetailToSaleDto) {
        console.log(saveSaleDTO, addDetailDTO, saleId);
        try {
            //Validar el dto AddDetailToSaleDto
            if(addDetailDTO.productBarCodeAtSale === '' && addDetailDTO.productUnitAtSale===''){
                return Result.failure<ErrorEntity>({
                    error: 'BadRequest',
                    message: 'Hubo un error al agregar el producto a la venta.',
                    path: '/sale/new',
                    statusCode: 400,
                    timestamp: new Date().toDateString()
                });
            }
            
            // Validar la cantidad a ingresar a la venta
            if(addDetailDTO.quantity <= 0){
                return Result.failure<ErrorEntity>({
                    error: 'BadRequest',
                    message: 'No puedes agregar 0 o menos de 0 productos a la venta.',
                    path: '/sale/new',
                    statusCode: 400,
                    timestamp: new Date().toDateString()
                });
            }

            if(saveSaleDTO.branchOfficeId === BigInt(0) && saveSaleDTO.employeeId === BigInt(0) && saveSaleDTO.customerId === BigInt(0)){
                return Result.failure<ErrorEntity>({
                    error: 'BadRequest',
                    message: 'Hubo un error al agregar el producto a la venta.',
                    path: '/sale/new',
                    statusCode: 500,
                    timestamp: new Date().toDateString()
                });
            }
            if(saveSaleDTO.customerId === BigInt(0)){
                return Result.failure<ErrorEntity>({
                    error: 'BadRequest',
                    message: 'Asegurate de tener creado el cliente por defecto(Publico en General)',
                    path: '/sale/new',
                    statusCode: 500,
                    timestamp: new Date().toDateString()
                });
            }

            let saveSaleResult: Result<SaleEntity, ErrorEntity>;
            let currentSaleId: bigint = saleId;
            // Verificar si hay una venta con ese ID
            saveSaleResult = await this.repository.findSaleWithDetails(currentSaleId);
            // Si no hay una venta con ese ID, se crea una nueva venta.
            if (!saveSaleResult.ok) {
                saveSaleResult = await this.repository.save(saveSaleDTO);
                currentSaleId = saveSaleResult.value?.saleId ?? BigInt(0);
            }
            
            // Agrega un detalle de venta a la venta
            const addResult = await this.repository.addDetailToSale(currentSaleId, addDetailDTO);
            // Verificar si no hubo un error a la hora de agregar un detalle de venta.
            if(!addResult.ok){
                const i :ErrorEntity | undefined = addResult.error;
                return Result.failure<ErrorEntity>({
                    error: i?.error ?? 'Hubo un error al agregar el producto ala venta.',
                    message: i?.message?? 'Hubo un error al agregar el producto ala venta.',
                    path: i?.path ?? '',
                    statusCode: i?.statusCode ?? 0,
                    timestamp: i?.timestamp?? ''
                });
            }

            // Realizar una consulta para ver todos los detalles de venta.
            const findSaleWithDetails = await this.repository.findSaleWithDetails(currentSaleId);
            return findSaleWithDetails;

        } catch (error) {
            return Result.failure<ErrorEntity>({
                error: 'BadRequest',
                message: 'Hubo un error al agregar el producto a la venta.',
                path: '/sale/new',
                statusCode: 500,
                timestamp: new Date().toDateString()
            });
        }

    }
}