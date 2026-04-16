import { TemplateRepository } from "@/shared/domain/repositories/template.repository";
import { AddressEntity } from "../entities/address.entity";

export interface AddressRepository extends TemplateRepository<AddressEntity> {
    existById(entityId: bigint): Promise<AddressEntity | null>;
}