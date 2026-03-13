import { EstablishmentRepository } from '../../domain/repositories/establishment.repository';
import { EstablishmentEntity } from '../../domain/entities/establishment.entity';
import { UpdateEstablishmentDto } from '../dtos/update-establishment.dto';
import { EstablishmentNotFoundException } from '../../domain/exceptions/establishment-not-found.exception';

export class UpdateEstablishmentUseCase {
  constructor(
    private readonly establishmentRepository: EstablishmentRepository,
  ) {}

  public async execute(command: UpdateEstablishmentDto): Promise<EstablishmentEntity> {
    //! Buscamos el establecimiento que se desea actualizar.
    const establishmentExist = await this.establishmentRepository.existById(command.establishmentId);
    
    //! Lanzamos exception para notificar que no se encontró el establecimiento.
    if(!establishmentExist){
      throw new EstablishmentNotFoundException('No se encontró el establecimiento.');
    }

    //! Si viene el nombre actualizarlo en la entidad de dominio
    if(command.name){
      establishmentExist.updateName(command.name);
    }

    const savedEntity = await this.establishmentRepository.save(establishmentExist);

    return savedEntity;
  }
}