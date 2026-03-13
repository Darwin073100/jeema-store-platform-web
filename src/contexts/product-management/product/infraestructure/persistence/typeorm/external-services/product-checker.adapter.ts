import { ProductCheckerPort } from "src/contexts/product-management/product/domain/ports/out/product-checker.port";
import { DataSource, Repository } from "typeorm";
import { ProductOrmEntity } from "../entities/product.orm-entity";
import { Injectable } from "@nestjs/common";

@Injectable()
export class ProductCheckerAdapter implements ProductCheckerPort{
    private readonly repository: Repository<ProductOrmEntity>;

    constructor(
        private readonly datasource: DataSource,
    ){
        this.repository = this.datasource.getRepository(ProductOrmEntity);
    }

    async check(productId: bigint):Promise<boolean> {
        const result = await this.repository.existsBy({productId})
        return result;
    }
}