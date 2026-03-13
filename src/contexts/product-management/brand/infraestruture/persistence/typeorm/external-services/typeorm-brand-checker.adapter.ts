import { BrandChekerPort } from "src/contexts/product-management/brand/domain/ports/out/brand-checker.port";
import { DataSource, Repository } from "typeorm";
import { BrandOrmEntity } from "../entities/brand-orm-entity";
import { Injectable } from "@nestjs/common";

@Injectable()
export class TypeormBrandCheckerAdapter implements BrandChekerPort {
    private readonly repository: Repository<BrandOrmEntity>
    constructor(private readonly datasource: DataSource){
        this.repository = this.datasource.getRepository(BrandOrmEntity);
    }

    async exists(brandId: bigint): Promise<boolean> {
        const result = await this.repository.existsBy({brandId});
        return result;
    }
}