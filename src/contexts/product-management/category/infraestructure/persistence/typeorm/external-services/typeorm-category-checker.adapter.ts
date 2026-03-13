import { CategoryCheckerPort } from "src/contexts/product-management/category/domain/ports/out/category-checker.port";
import { DataSource, Repository } from "typeorm";
import { CategoryOrmEntity } from "../entities/category.orm-entity";
import { Injectable } from "@nestjs/common";

@Injectable()
export class TypeormCategoryCheckerAdapter implements CategoryCheckerPort {
    private readonly repository: Repository<CategoryOrmEntity>;

    constructor(private readonly datasource: DataSource){
        this.repository = this.datasource.getRepository(CategoryOrmEntity);
    }

    async exists(categoryId: bigint): Promise<boolean> {
        const result = await this.repository.existsBy({categoryId});
        return result;
    }
}