import { SaleDetailAppMapper } from "src/contexts/sale-management/sale-detail/application/mappers/sale-detail.app-mapper";
import { SaleEntity } from "../../domain/entities/sale.entity";
import { SaleResponseDto } from "../dtos/sale-response.dto";
import { EmployeeMapper } from "src/contexts/employee-management/employee/application/mappers/employee.mapper";
import { CustomerMapper } from "src/contexts/sale-management/customer/application/mappers/customer.mapper";
import { BranchOfficeMapper } from "src/contexts/establishment-management/branch-office/application/mappers/branch-office.mapper";
import { SalePaymentMapper } from "src/contexts/sale-management/sale-payment/application/mappers/sale-payment.mapper";
import { CashSessionMapper } from "src/contexts/cash-management/cash-session/application/mappers/cash-session.mapper";
import { ISale } from "../../presentation/interfaces/ISale";

export class SaleMapper {
  /**
   * Convierte una entidad de dominio Sale a un DTO de respuesta.
   *
   * @param entity La entidad Sale a mapear.
   * @returns Un SaleResponseDto.
   */
  public static toResponseDto(entity: SaleEntity): SaleResponseDto {
    return new SaleResponseDto(
      entity.saleId,
      entity.branchOfficeId,
      entity.customerId,
      entity.employeeId,
      entity.cashSessionId,
      Number(entity.subTotalAmount),
      Number(entity.discountAmount),
      Number(entity.taxAmount),
      Number(entity.totalAmount),
      Number(entity.inAmount),
      Number(entity.outAmount),
      entity.status,
      entity.notes,
      entity.createdAt,
      entity.updatedAt,
      entity.deletedAt,
      entity.branchOffice? BranchOfficeMapper.toResponseDto(entity.branchOffice) : null,
      entity.customer? CustomerMapper.toResponseDto(entity.customer) : null,
      entity.employee? EmployeeMapper.toResponseDto(entity.employee) : null,
      entity.cashSession? CashSessionMapper.toResponseDto(entity.cashSession) : null,
      entity.saleDetails?.map(item=> SaleDetailAppMapper.toResponseDto(item)) ?? [],
      entity.salePayments?.map(item=> SalePaymentMapper.toResponseDto(item)) ?? [],
    );
  }
  public static toIResponse(entity: SaleEntity): ISale {
    return {
      saleId: entity.saleId,
      branchOfficeId: entity.branchOfficeId,
      customerId: entity.customerId,
      employeeId: entity.employeeId,
      cashSessionId: entity.cashSessionId,
      subTotalAmount: Number(entity.subTotalAmount),
      discountAmount: Number(entity.discountAmount),
      taxAmount: Number(entity.taxAmount),
      totalAmount: Number(entity.totalAmount),
      inAmount: Number(entity.inAmount),
      outAmount: Number(entity.outAmount),
      status: entity.status,
      notes: entity.notes,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      deletedAt: entity.deletedAt,
      branchOffice: entity.branchOffice? BranchOfficeMapper.toIResponse(entity.branchOffice) : null,
      customer: entity.customer? CustomerMapper.toIResponse(entity.customer) : null,
      employee: entity.employee? EmployeeMapper.toIResponse(entity.employee) : null,
      cashSession: entity.cashSession? CashSessionMapper.toIResponse(entity.cashSession) : null,
      saleDetails: entity.saleDetails?.map(item=> SaleDetailAppMapper.toIResponse(item)) ?? [],
      salePayments: entity.salePayments?.map(item=> SalePaymentMapper.toIResponse(item)) ?? [],
    };
  }
}
