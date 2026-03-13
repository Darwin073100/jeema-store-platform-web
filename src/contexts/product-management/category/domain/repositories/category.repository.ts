import { TemplateRepository } from "src/shared/domain/repositories/template.repository";
import { CategoryEntity } from "../entities/category-entity";

export const CATEGORY_REPOSITORY = Symbol('CATEGORY_REPOSITORY');

export interface CategoryRepository extends TemplateRepository<CategoryEntity>{
    findAllByEstablishment(establishmentId: bigint): Promise<CategoryEntity[]>;
}