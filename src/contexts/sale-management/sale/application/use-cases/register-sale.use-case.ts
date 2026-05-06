import { SaleEntity } from "../../domain/entities/sale.entity";
import { SaleRepository } from "../../domain/repositories/sale.repository";
import { RegisterSaleDto } from "../dtos/register-sale.dto";
import { SaleNotFoundException } from "../../domain/exceptions/sale-not-found.exception";
import { SaleStatusEnum } from "../../domain/enums/sale-status.enum";
import { CashSessionRepository } from "src/contexts/cash-management/cash-session/domain/repositories/cash-session.repository";
import { SaleConflictException } from "../../domain/exceptions/sale-conflict.exception";
import { TransactionDBRepository } from "@/configuration/databases/typeorm/transaction-db/domain/repositories/transaction-db-repository";
import { EmployeeRepository } from "@/contexts/employee-management/employee/domain/repositories/employee.repository";
import { CustomerRepository } from "@/contexts/sale-management/customer/domain/repositories/customer.repository";
import { BranchOfficeRepository } from "@/contexts/establishment-management/branch-office/domain/repositories/branch-office.repository";

export class RegisterSaleUseCase {
  constructor(
    private readonly repository: SaleRepository,
    private readonly branchOfficeRepository: BranchOfficeRepository,
    private readonly customerRepository: CustomerRepository,
    private readonly employeeRepository: EmployeeRepository,
    private readonly cashSessionRepo: CashSessionRepository,
    private readonly transactionDB: TransactionDBRepository
  ) { }

  public async execute(command: RegisterSaleDto): Promise<SaleEntity> {
    try {
      await this.transactionDB.beginTransaction();
      // Validar que la sucursal exista
      const branchOfficeExists = await this.branchOfficeRepository.existById(command.branchOfficeId);
      if (!branchOfficeExists) {
        throw new SaleNotFoundException(`La sucursal con id ${command.branchOfficeId} no existe.`);
      }

      // Validar customer
      const customerExists = await this.customerRepository.existById(command.customerId);
      if (!customerExists) {
        throw new SaleNotFoundException(`El cliente con id ${command.customerId} no existe.`);
      }

      // validar el employee
      const employeeExists = await this.employeeRepository.existById(command.employeeId);
      if (!employeeExists) {
        throw new SaleNotFoundException(`El empleado con id ${command.employeeId} no existe.`);
      }

      const cashSession = await this.cashSessionRepo.isClosedCashSession(command.cashRegisterId);
      if (!cashSession) throw new SaleConflictException(`Necesitas aperturar caja para continuar.`);

      // Crear la entidad de agregado de dominio "Sale" a partir del comando (DTO).
      const createdSale = SaleEntity.create(
        command.branchOfficeId,
        command.customerId,
        command.employeeId,
        cashSession.cashSessionId,
        0,
        0,
        0,
        0,
        0,
        0,
        SaleStatusEnum.INITIALIZED,
        null,
        null,
        null,
      );

      // Persistir el agregado de dominio a través del repositorio (Puerto de Salida).
      const savedEntity = await this.repository.save(createdSale);
      await this.transactionDB.commit();
      return savedEntity;
    } catch (error) {
      await this.transactionDB.rollback();
      throw error;
    }
  }
}