import { SaleEntity } from "../../domain/entities/sale.entity";
import { SaleRepository } from "../../domain/repositories/sale.repository";
import { RegisterSaleDto } from "../dtos/register-sale.dto";
import { BranchOfficeCheckerPort } from "src/contexts/establishment-management/branch-office/domain/ports/out/branch-office-checker.port";
import { EmployeeChekerPort } from "src/contexts/employee-management/employee/domain/ports/out/employee-checker.port";
import { SaleNotFoundException } from "../../domain/exceptions/sale-not-found.exception";
import { CustomerCheckerPort } from "src/contexts/sale-management/customer/domain/ports/out/customer-checker-port";
import { SaleStatusEnum } from "../../domain/enums/sale-status.enum";
import { CashSessionRepository } from "src/contexts/cash-management/cash-session/domain/repositories/cash-session.repository";
import { SaleConflictException } from "../../domain/exceptions/sale-conflict.exception";
import { TransactionDBRepository } from "@/configuration/databases/typeorm/transaction-db/domain/repositories/transaction-db-repository";

export class RegisterSaleUseCase {
  constructor(
    private readonly repository: SaleRepository,
    private readonly branchOfficeCheckerPort: BranchOfficeCheckerPort,
    private readonly customerCheckerPort: CustomerCheckerPort,
    private readonly employeeCheckerPort: EmployeeChekerPort,
    private readonly cashSessionRepo: CashSessionRepository,
    private readonly transactionDB: TransactionDBRepository
  ) { }

  public async execute(command: RegisterSaleDto): Promise<SaleEntity> {
    try {
      this.transactionDB.beginTransaction();
      // Validar que la sucursal exista
      const branchOfficeExists = await this.branchOfficeCheckerPort.existById(command.branchOfficeId);
      if (!branchOfficeExists) {
        throw new SaleNotFoundException(`La sucursal con id ${command.branchOfficeId} no existe.`);
      }

      // Validar customer
      const customerExists = await this.customerCheckerPort.existById(command.customerId);
      if (!customerExists) {
        throw new SaleNotFoundException(`El cliente con id ${command.customerId} no existe.`);
      }

      // validar el employee
      const employeeExists = await this.employeeCheckerPort.exists(command.employeeId);
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
      this.transactionDB.commit();
      return savedEntity;
    } catch (error) {
      this.transactionDB.rollback();
      throw error;
    }
  }
}