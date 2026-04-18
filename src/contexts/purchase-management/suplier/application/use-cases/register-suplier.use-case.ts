import { SuplierRepository } from "../../domain/repositories/suplier.repository";
import { RegisterSuplierDto } from "../dtos/register-suplier.dto";
import { SuplierEntity } from "../../domain/entities/suplier.entity";
import { SuplierAlreadyExistsException } from "../../domain/exceptions/suplier-already-exists.exception";
import { EstablishmentRepository } from "src/contexts/establishment-management/establishment/domain/repositories/establishment.repository";
import { SuplierNotFoundException } from "../../domain/exceptions/suplier-not-found.exception";
import { AddressEntity } from "@/contexts/establishment-management/address/domain/entities/address.entity";
import { AddressRepository } from "@/contexts/establishment-management/address/domain/repository/address.repository";
import { TransactionDBRepository } from "@/configuration/databases/typeorm/transaction-db/domain/repositories/transaction-db-repository";

export class RegisterSuplierUseCase {
  constructor(
    private readonly suplierRepository: SuplierRepository,
    private readonly establishmentRepo: EstablishmentRepository,
    private readonly addressRepository: AddressRepository,
    private readonly transactionDB: TransactionDBRepository,
  ) { }

  async execute(request: RegisterSuplierDto): Promise<SuplierEntity> {
    try {
      await this.transactionDB.beginTransaction();
      const establishmentExist = await this.establishmentRepo.findById(request.establishmentId);
      if (!establishmentExist) {
        throw new SuplierNotFoundException('No se encontró el establecimiento.');
      }
      const address = request.address ? AddressEntity.create(
        request.address.country,
        request.address.state,
        request.address.postalCode,
        request.address.municipality,
        request.address.city,
        request.address.street,
        request.address.externalNumber,
        request.address.internalNumber,
        request.address.neighborhood,
        request.address.reference,
      ) : null;

      const suplier = SuplierEntity.create(
        request.establishmentId,
        null,
        request.name,
        request.contactPerson,
        request.phoneNumber,
        request.email,
        request.rfc,
        request.notes,
        null,
      );

      if (address) {
        const resultAddress = await this.addressRepository.save(address);
        suplier.updateAddressId(resultAddress.addressId);
      }

      if (!!suplier.email) {
        const emailExist = await this.suplierRepository.findByEmail(suplier.email, suplier.establishmentId);
        if (emailExist) {
          throw new SuplierAlreadyExistsException('Ya hay un proveedor con el mismo correo electrónico en el establecimiento.');
        }
      }

      if (!!suplier.rfc) {
        const rfcExist = await this.suplierRepository.findByRfc(suplier.rfc, suplier.establishmentId);
        if (rfcExist) {
          throw new SuplierAlreadyExistsException('Ya hay un proveedor con el mismo RFC en el establecimiento.');
        }
      }

      const resp = await this.suplierRepository.save(suplier);
      await this.transactionDB.commit();
      return resp;
    }
    catch(error) {
      this.transactionDB.rollback();
      throw error;
    }

  }
}