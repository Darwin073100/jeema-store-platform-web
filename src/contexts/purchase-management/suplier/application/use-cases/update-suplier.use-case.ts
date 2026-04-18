import { SuplierRepository } from "../../domain/repositories/suplier.repository";
import { SuplierEntity } from "../../domain/entities/suplier.entity";
import { SuplierAlreadyExistsException } from "../../domain/exceptions/suplier-already-exists.exception";
import { UpdateSuplierDto } from "../dtos/update-suplier.dto";
import { SuplierNotFoundException } from "../../domain/exceptions/suplier-not-found.exception";

export class UpdateSuplierUseCase {
  constructor(
    private readonly suplierRepository: SuplierRepository,
  ) {}

  async execute(request: UpdateSuplierDto): Promise<SuplierEntity> {
    const suplier = await this.suplierRepository.existById(request.suplierId);
    if(!suplier){
      throw new SuplierNotFoundException('Proveedor no encontrado');
    }

    if(!!suplier.email){
      const emailExist = await this.suplierRepository.findByEmail(suplier.email, suplier.establishmentId);
      if(emailExist){
        if(emailExist.suplierId !== request.suplierId){
          throw new SuplierAlreadyExistsException('Ya hay un proveedor con el mismo correo electrónico en el establecimiento.');
        }
      }
    }

    if(!!suplier.rfc){
      const rfcExist = await this.suplierRepository.findByRfc(suplier.rfc, suplier.establishmentId);
      if(rfcExist){
        if(rfcExist.suplierId !== request.suplierId){
          throw new SuplierAlreadyExistsException('Ya hay un proveedor con el mismo RFC en el establecimiento.');
        }
      }
    }

    if(request.name !== undefined){
      suplier.updateName(request.name);
    }
    if(request.contactPerson !== undefined){
      suplier.updateContactPerson(request.contactPerson);
    }
    if(request.phoneNumber !== undefined){
      suplier.updatePhoneNumber(request.phoneNumber);
    }
    if(request.rfc !== undefined){
      suplier.updateRFC(request.rfc);
    }
    if(request.notes !== undefined){
      suplier.updateNotes(request.notes);
    }
    if(request.email !== undefined){
      suplier.updateEmail(request.email);
    }
    if(request.softDelete !== undefined){
      suplier.softDelete();
    }

    const resp = await this.suplierRepository.save(suplier);
    return resp;
  }
}