import { BranchOfficeRepository } from "../../domain/repositories/branch-office.repository";
import { BranchOfficeNotFoundException } from "../../domain/exceptions/branch-office-not-found.exception";
import { TransactionDBRepository } from "@/configuration/databases/typeorm/transaction-db/domain/repositories/transaction-db-repository";
import { EstablishmentRepository } from "@/contexts/establishment-management/establishment/domain/repositories/establishment.repository";
import { RegisterBranchAndEstablishmentDto } from "../dtos/register-branch-and-establishment.dto";
import { CloudBranchOfficeRepository } from "../../domain/repositories/cloud-branch-office.repository";
import { Result } from "@/shared/lib/utils/result";
import { ICloudBranchOffice } from "../../presentation/interfaces/ICloudBranchOffice";
import { ErrorEntity } from "@/shared/lib/utils/error.entity";

export class RegisterCloudBranchAndCloudEstablishmentUseCase {
  constructor(
    private readonly branchOfficeRepository: BranchOfficeRepository,
    private readonly cloudBranchOfficeRepository: CloudBranchOfficeRepository,
    private readonly establishmentRepository: EstablishmentRepository,
    private readonly transactionDB: TransactionDBRepository,
  ) { }

  async execute(dto: RegisterBranchAndEstablishmentDto): Promise<Result<ICloudBranchOffice, ErrorEntity>> {
    // Verificar la existencia de la sucursal
    const branchExist = await this.branchOfficeRepository.existById(dto.branchOfficeId);
    if (!branchExist) {
      throw new BranchOfficeNotFoundException('No se encontro la sucursal involucrada.');
    }

    // Verificar la existencia del establecimiento
    const establishmentExist = await this.establishmentRepository.existById(dto.establishmentId);
    if (!establishmentExist) {
      throw new BranchOfficeNotFoundException('No se encontro el establecimiento involucrado.');
    }

    return await this.transactionDB.runInTransaction(async () => {
      // Hacemos el request al servidor de traspasos
      const result = await this.cloudBranchOfficeRepository.registerCloudBranchAndCloudEstablishment({
        branchOfficeName: dto.branchOfficeName,
        establishmentName: dto.establishmentName,
        localBranchOfficeId: dto.branchOfficeId,
        enrollmentKey: dto.enrollmentKey
      });

      if(result.ok && result.value){
        branchExist.updateCloudBranchOfficeId(BigInt(result.value.cloudBranchOfficeId));
        establishmentExist.updateCloudEstablishmentId(BigInt(result.value.cloudEstablishmentId));
      }

      // Persistir los cambios en la db
      await this.branchOfficeRepository.updateTransactional(branchExist);
      await this.establishmentRepository.transactionUpdate(establishmentExist);

      return result;
    });
  }
}