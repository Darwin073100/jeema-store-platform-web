import { BranchOfficeRepository } from "../../domain/repositories/branch-office.repository";
import { BranchOfficeNotFoundException } from "../../domain/exceptions/branch-office-not-found.exception";
import { TransactionDBRepository } from "@/configuration/databases/typeorm/transaction-db/domain/repositories/transaction-db-repository";
import { EstablishmentRepository } from "@/contexts/establishment-management/establishment/domain/repositories/establishment.repository";
import { CloudBranchOfficeRepository } from "../../domain/repositories/cloud-branch-office.repository";
import { Result } from "@/shared/lib/utils/result";
import { ICloudBranchOffice } from "../../presentation/interfaces/ICloudBranchOffice";
import { ErrorEntity } from "@/shared/lib/utils/error.entity";
import { RegisterCloudBranchDto } from "../dtos/register-cloud-branch.dto";

export class RegisterCloudBranchUseCase {
  constructor(
    private readonly branchOfficeRepository: BranchOfficeRepository,
    private readonly cloudBranchOfficeRepository: CloudBranchOfficeRepository,
    private readonly establishmentRepository: EstablishmentRepository,
    private readonly transactionDB: TransactionDBRepository,
  ) { }

  // TODO: Debemos eliminar los cambios en la nube por si hay un error en el sistema local
  async execute(dto: RegisterCloudBranchDto): Promise<Result<ICloudBranchOffice, ErrorEntity>> {
    // Verificar la existencia de la sucursal
    const branchExist = await this.branchOfficeRepository.existById(dto.branchOfficeId);
    if (!branchExist) {
      throw new BranchOfficeNotFoundException('No se encontro la sucursal involucrada.');
    }

    // Verificar la existencia del establecimiento
    const establishmentExist = await this.establishmentRepository.existById(branchExist.establishmentId);
    if (!establishmentExist) {
      throw new BranchOfficeNotFoundException('No se encontro el establecimiento involucrado.');
    }

    return await this.transactionDB.runInTransaction(async () => {
      // Hacemos el request al servidor de traspasos
      const result = await this.cloudBranchOfficeRepository.registerCloudBranch({
        branchOfficeName: dto.branchOfficeName,
        branchOfficeId: dto.branchOfficeId,
        enrollmentKey: dto.enrollmentKey
      });

      if(result.ok && result.value && result.value.cloudEstablishment?.enrollmentKey && result.value.cloudEstablishment?.enrollmentKey.trim().length > 0){
        establishmentExist.updateEnrollmentKey(result.value.cloudEstablishment?.enrollmentKey);
        branchExist.updateCloudBranchOfficeId(BigInt(result.value.cloudBranchOfficeId));
        establishmentExist.updateCloudEstablishmentId(BigInt(result.value.cloudEstablishmentId));
        // Persistir los cambios en la db
        await this.branchOfficeRepository.updateTransactional(branchExist);
        await this.establishmentRepository.transactionUpdate(establishmentExist);
      } else {
        throw new Error('Ha ocurrrido un error al registrar la sucursal y el establecimiento en la nube.');
      }


      return result;
    });
  }
}