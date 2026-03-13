import { BranchOfficeRepository } from "../../domain/repositories/branch-office.repository";
import { RegisterBranchOfficeDto } from "../dtos/register-branch-office.dto";
import { BranchOfficeEntity } from "../../domain/entities/branch-office.entity";
import { EstablishmentCheckerPort } from "src/contexts/establishment-management/establishment/application/ports/out/establishment-checker.port";
import { EstablishmentNotFoundException } from "src/contexts/establishment-management/establishment/domain/exceptions/establishment-not-found.exception";
import { AddressEntity } from "src/shared/domain/entities/address.entity";


export class RegisterBranchOfficeUseCase {
  constructor(
    private readonly branchOfficeRepository: BranchOfficeRepository,
    private readonly establishmentCheckerPort: EstablishmentCheckerPort
  ) {}

  async execute(request: RegisterBranchOfficeDto): Promise<BranchOfficeEntity> {
    // 1. Verificar la existencia del Establishment
    const establishmentExists = await this.establishmentCheckerPort.exists(request.establishmentId);
    if (!establishmentExists) {
      throw new EstablishmentNotFoundException('Ingresa un id de algun establecimiento existente.');
    }

    const address = AddressEntity.create(
      request.address.country,
      request.address.state,
      request.address.postalCode,
      request.address.municipality,
      request.address.city,
      request.address.street,
      request.address.externalNumber,
      request.address.internalNumber,
      request.address.neighborhood,
      request.address.reference
    );

    const branchOffice = BranchOfficeEntity.create(
      request.name,
      address,
      request.establishmentId,
    );

    const resp = await this.branchOfficeRepository.save(branchOffice);

    return resp;
  }
}