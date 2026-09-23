import { BranchOfficeRepository } from "src/contexts/establishment-management/branch-office/domain/repositories/branch-office.repository";
import { EstablishmentRepository } from "src/contexts/establishment-management/establishment/domain/repositories/establishment.repository";
import { CloudBranchOfficeRepository } from "src/contexts/establishment-management/branch-office/domain/repositories/cloud-branch-office.repository";
import { ICloudBranchOffice } from "src/contexts/establishment-management/branch-office/presentation/interfaces/ICloudBranchOffice";
import { InvalidCloudTransferException } from "../../domain/exceptions/invalid-cloud-transfer.exception";
import { Result } from "@/shared/lib/utils/result";
import { ErrorEntity } from "@/shared/lib/utils/error.entity";

/**
 * Directorio de sucursales destino para la pantalla `/transfers/new`. `GET
 * /cloud-branch-offices/by-enrollment-key/:enrollmentKey` (EDYOF) devuelve todas las sucursales inscritas
 * con la misma clave que la sucursal de origen — reemplaza la captura libre de `toCloudBranchOfficeId` (ver
 * spect/08_cloud_transfer_spect.md sección 8.4, ya no vigente ahora que ese endpoint existe). Se excluye la
 * propia sucursal de origen del resultado.
 */
export class ListCloudBranchOfficesForTransferUseCase {
    constructor(
        private readonly branchOfficeRepository: BranchOfficeRepository,
        private readonly establishmentRepository: EstablishmentRepository,
        private readonly cloudBranchOfficeRepository: CloudBranchOfficeRepository,
    ) { }

    async execute(fromBranchOfficeId: bigint): Promise<Result<ICloudBranchOffice[], ErrorEntity>> {
        const fromBranch = await this.branchOfficeRepository.findById(fromBranchOfficeId);
        if (!fromBranch) {
            throw new InvalidCloudTransferException(`La sucursal de origen (${fromBranchOfficeId}) no existe.`);
        }
        if (!fromBranch.cloudBranchOfficeId) {
            throw new InvalidCloudTransferException('La sucursal de origen no está inscrita en la nube (cloudBranchOfficeId nulo).');
        }

        const establishment = await this.establishmentRepository.findById(fromBranch.establishmentId);
        const enrollmentKey = establishment?.enrollmentKey ?? null;
        if (!enrollmentKey) {
            throw new InvalidCloudTransferException('El establecimiento no tiene una clave de inscripción configurada.');
        }

        const result = await this.cloudBranchOfficeRepository.findAllByEnrollmentKey(enrollmentKey);
        if (!result.ok || !result.value) {
            return result;
        }

        const destinations = result.value.filter(
            (branch) => branch.cloudBranchOfficeId !== fromBranch.cloudBranchOfficeId!.toString(),
        );
        return Result.success(destinations);
    }
}
