import { TemplateRepository } from "@/shared/domain/repositories/template.repository";
import { AddressEntity } from "../entities/address.entity";

export interface AddressRepository extends TemplateRepository<AddressEntity> {
    
}