import { BranchOfficeRepository } from "../../domain/repositories/branch-office.repository";
import { BranchOfficeEntity } from "../../domain/entities/branch-office.entity";
import { UpdateBranchOfficeDto } from "../dtos/update-branch-office.dto";
import { BranchOfficeNotFoundException } from "../../domain/exceptions/branch-office-not-found.exception";
import { TransactionDBRepository } from "@/configuration/databases/typeorm/transaction-db/domain/repositories/transaction-db-repository";

export class UpdateBranchOfficeUseCase {
  constructor(
    private readonly branchOfficeRepository: BranchOfficeRepository,
    private readonly transactionDB: TransactionDBRepository,
  ) {}

  async execute(request: UpdateBranchOfficeDto): Promise<BranchOfficeEntity> {
    // Verificar la existencia de la sucursal
    const branchExist = await this.branchOfficeRepository.existById(request.branchOfficeId);
    if (!branchExist) {
      throw new BranchOfficeNotFoundException('No se encontro la sucursal a editar.');
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