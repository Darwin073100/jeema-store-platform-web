import { BranchOfficeRepository } from "../../domain/repositories/branch-office.repository";
import { BranchOfficeEntity } from "../../domain/entities/branch-office.entity";
import { BranchOfficeNotFoundException } from "../../domain/exceptions/branch-office-not-found.exception";
import { TransactionDBRepository } from "@/configuration/databases/typeorm/transaction-db/domain/repositories/transaction-db-repository";
import { EstablishmentRepository } from "@/contexts/establishment-management/establishment/domain/repositories/establishment.repository";
import { RegisterCloudBranchAndCloudEstablishmentDto } from "../dtos/register-cloud-branch-and-cloud-establishment.dto";

export class RegisterCloudBranchAndCloudEstablishmentUseCase {
  constructor(
    private readonly branchOfficeRepository: BranchOfficeRepository,
    private readonly establishmentRepository: EstablishmentRepository,
    private readonly transactionDB: TransactionDBRepository,
  ) {}

  async execute(request: RegisterCloudBranchAndCloudEstablishmentDto): Promise<BranchOfficeEntity> {
    // Verificar la existencia de la sucursal
    const branchExist = await this.branchOfficeRepository.existById(request.branchOfficeId);
    if (!branchExist) {
      throw new BranchOfficeNotFoundException('No se encontro la sucursal involucrada.');
    }

    // Verificar la existencia del establecimiento
    const establishmentExist = await this.establishmentRepository.existById(request.establishmentId);
    if (!establishmentExist) {
      throw new BranchOfficeNotFoundException('El establecimiento involucrado.');
    }

    // Verificar si el usuario quiere modificar el nombre
    if(request.name){
      branchExist.updateName(request.name);
    }

    // Persistir los cambios en la db
    const resp = await this.branchOfficeRepository.updateTransactional(branchExist);
    return resp;
  }
}