import { Injectable } from "@nestjs/common";
import { LotCheckerPort } from "src/contexts/purchase-management/lot/domain/ports/out/lot-checker.port";
import { DataSource, Repository } from "typeorm";
import { LotOrmEntity } from "../entities/lot.orm-entity";

@Injectable()
export class LotCheckerAdapter implements LotCheckerPort{
     private ormLotRepository: Repository<LotOrmEntity>;
    
      constructor(private readonly dataSource: DataSource) {
        this.ormLotRepository = this.dataSource.getRepository(LotOrmEntity);
      }

    async exists(lotId: bigint): Promise<boolean> {
        return await this.ormLotRepository.exist({
            where: { lotId },
        });
    }

    async matchLotAndProduct(lotId: bigint, productId: bigint): Promise<boolean> {
      return await this.ormLotRepository.existsBy({productId, lotId});
    }
}