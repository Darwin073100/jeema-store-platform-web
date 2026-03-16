import { InventoryMapper } from "src/contexts/inventory-management/inventory/application/mapper/inventory.mapper";
import { ReturnsEntity } from "../../domain/entities/returns.entity";
import { ReturnsResponse } from "../dtos/returns-response.dto";
import { SaleDetailAppMapper } from "src/contexts/sale-management/sale-detail/application/mappers/sale-detail.app-mapper";
import { EmployeeMapper } from "src/contexts/employee-management/employee/application/mappers/employee.mapper";
import { IReturns } from "../../presentation/interfaces/IReturns";

export class ReturnsAppMapper {
    public static toResponse(returns: ReturnsEntity){
        const response: ReturnsResponse = {
            returnsId: returns.returnsId,
            employeeId: returns.employeeId,
            inventoryId: returns.inventoryId,
            saleDetailId: returns.saleDetailId,
            notes: returns.notes,
            createdAt: returns.createdAt,
            updatedAt: returns.updatedAt,
            deletedAt: returns.deletedAt,
            quantityReturn: returns.quantityReturn,
            amountReturn: returns.amountReturn,
            inventory: returns.inventory? InventoryMapper.toResponseDto(returns.inventory): null,
            saleDetail: returns.saleDetail? SaleDetailAppMapper.toResponseDto(returns.saleDetail): null,
            employee: returns.employee? EmployeeMapper.toResponseDto(returns.employee): null,
        }
        return response;
    }
    public static toIResponse(returns: ReturnsEntity): IReturns{
        return {
            returnsId: returns.returnsId,
            employeeId: returns.employeeId,
            inventoryId: returns.inventoryId,
            saleDetailId: returns.saleDetailId,
            notes: returns.notes,
            createdAt: returns.createdAt,
            updatedAt: returns.updatedAt,
            deletedAt: returns.deletedAt,
            quantityReturn: returns.quantityReturn,
            amountReturn: returns.amountReturn,
            inventory: returns.inventory? InventoryMapper.toIResponse(returns.inventory): null,
            saleDetail: returns.saleDetail? SaleDetailAppMapper.toIResponse(returns.saleDetail): null,
            employee: returns.employee? EmployeeMapper.toIResponse(returns.employee): null,
        };
    }
}