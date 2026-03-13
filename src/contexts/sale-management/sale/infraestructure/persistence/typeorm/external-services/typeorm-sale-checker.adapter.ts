import { DataSource, Repository } from "typeorm";
import { SaleOrmEntity } from "../entities/sale.orm-entity";
import { Injectable } from "@nestjs/common";
import { SaleCheckerPort } from "src/contexts/sale-management/sale/domain/ports/out/sale-checker.port";

@Injectable()
export class TypeormSaleCheckerAdapter implements SaleCheckerPort {
    private readonly repository: Repository<SaleOrmEntity>;

    constructor(private readonly datasource: DataSource){
        this.repository = this.datasource.getRepository(SaleOrmEntity);
    }

    async existById(entityId: bigint): Promise<boolean> {
        const result = await this.repository.existsBy({saleId: entityId});
        return result;
    }
}