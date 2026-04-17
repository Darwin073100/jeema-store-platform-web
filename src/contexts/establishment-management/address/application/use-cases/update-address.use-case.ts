import { TransactionDBRepository } from "@/configuration/databases/typeorm/transaction-db/domain/repositories/transaction-db-repository";
import { AddressRepository } from "../../domain/repository/address.repository";
import { UpdateAddressMany } from "../dtos/update-address-many.dto";

export class UpdateAddressUseCase {
    constructor(
        private readonly addressRepository: AddressRepository,
        private readonly transactionDB: TransactionDBRepository
    ) { }

    async execute(dto: UpdateAddressMany) {
        try {
            const addressExist = await this.addressRepository.existById(dto.addressId);
            if(!addressExist){
                throw new Error('No se encontró la dirección.');
            }

            if(dto.externalNumber!== undefined){
                addressExist.updateExternalNumber(dto.externalNumber);    
            }
            if(dto.internalNumber !== undefined){
                addressExist.updateInternalNumber(dto.internalNumber);
            }
            if(dto.street !== undefined){
                addressExist.updateStreet(dto.street);
            }
            if(dto.neighborhood !== undefined){
                addressExist.updateNeighborhood(dto.neighborhood);
            }
            if(dto.municipality !== undefined){
                addressExist.updateMunicipality(dto.municipality);
            }
            if(dto.city !== undefined){
                addressExist.updateCity(dto.city);
            }
            if(dto.country !== undefined){
                addressExist.updateCountry(dto.country);
            }
            if(dto.postalCode !== undefined){
                addressExist.updatePostalCode(dto.postalCode);
            }
            if(dto.reference !== undefined){
                addressExist.updateReference(dto.reference);
            }

            await this.transactionDB.beginTransaction();
            const addressResult = await this.addressRepository.save(addressExist);
            return addressResult;            
        } catch (error) {
            await this.transactionDB.rollback();
            throw error;
        }
    }
}