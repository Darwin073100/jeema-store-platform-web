import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { LotOrmEntity } from "./infraestructura/persistence/typeorm/entities/lot.orm-entity";
import { ProductModule } from "src/contexts/product-management/product/product.module";
import { LotController } from "./presentation/controllers/lot.controller";
import { LOT_REPOSITORY, LotRepository } from "./domain/repositories/lot.repository";
import { TypeOrmLotRepository } from "./infraestructura/persistence/typeorm/repositories/typeorm-lot.repository";
import { RegisterLotUseCase } from "./application/use-case/register-lot.use-case";
import { PRODUCT_CHECKER_PORT, ProductCheckerPort } from "src/contexts/product-management/product/domain/ports/out/product-checker.port";
import { LOT_CHECKER_PORT, LotCheckerPort } from "./domain/ports/out/lot-checker.port";
import { LotCheckerAdapter } from "./infraestructura/persistence/typeorm/external-service/lot-checker.adapter";
import { UpdateLotUseCase } from "./application/use-case/update-lot.use-case";
import { UpdateLotUnitPurchaseUseCase } from "./application/use-case/update-lot-unit-purchase.use-case";
import { LOT_UNIT_PURCHASE_REPOSITORY, LotUnitPurchaseRepository } from "./domain/repositories/lot-unit-purchase.repository";
import { TypeormLotUnitPurchaseRepository } from "./infraestructura/persistence/typeorm/repositories/typeorm-lot-unit-purchase.repository";
import { RegisterLotUnitPurchaseUseCase } from "./application/use-case/register-lot-unit-purchase.use-case";
import { DeleteLotUseCase } from "./application/use-case/delete-lot.use-case";
import { DeleteLotUnitPurchaseUseCase } from "./application/use-case/delete-lot-unit-purchase.use-case";
import { ConnectionDBModule } from "src/config/database/typeorm/connection/connection-db.module";
import { FindReportLotsUseCase } from "./application/use-case/find-report-lots.use-case";

@Module({
    imports:[
        TypeOrmModule.forFeature([LotOrmEntity]),
        ProductModule,
        ConnectionDBModule,
    ],
    providers:[
        {
            provide: LOT_REPOSITORY,
            useClass: TypeOrmLotRepository
        },
        {
            provide: LOT_UNIT_PURCHASE_REPOSITORY,
            useClass: TypeormLotUnitPurchaseRepository
        },
        {
            provide: LOT_CHECKER_PORT,
            useClass: LotCheckerAdapter
        },
        {
            provide: RegisterLotUseCase,
            useFactory: (repo: LotRepository, productChecker: ProductCheckerPort)=>{
                return new RegisterLotUseCase(repo, productChecker);
            },
            inject: [
                LOT_REPOSITORY,
                PRODUCT_CHECKER_PORT
            ]
        },
        {
            provide: UpdateLotUseCase,
            useFactory: (repo: LotRepository, productChecker: ProductCheckerPort)=>{
                return new UpdateLotUseCase(repo, productChecker);
            },
            inject: [
                LOT_REPOSITORY,
                PRODUCT_CHECKER_PORT
            ]
        },
        {
            provide: UpdateLotUnitPurchaseUseCase,
            useFactory: (repo: LotUnitPurchaseRepository, lotChecker: LotCheckerPort)=>{
                return new UpdateLotUnitPurchaseUseCase(repo, lotChecker);
            },
            inject: [
                LOT_UNIT_PURCHASE_REPOSITORY,
                LOT_CHECKER_PORT
            ]
        },
        {
            provide: RegisterLotUnitPurchaseUseCase,
            useFactory: (repo: LotUnitPurchaseRepository, lotChecker: LotCheckerPort)=>{
                return new RegisterLotUnitPurchaseUseCase(repo, lotChecker);
            },
            inject: [
                LOT_UNIT_PURCHASE_REPOSITORY,
                LOT_CHECKER_PORT
            ]
        },
        {
            provide: DeleteLotUseCase,
            useFactory: (repo: LotRepository)=>{
                return new DeleteLotUseCase(repo);
            },
            inject: [ LOT_REPOSITORY ]
        },
        {
            provide: FindReportLotsUseCase,
            useFactory: (repo: LotRepository)=>{
                return new FindReportLotsUseCase(repo);
            },
            inject: [ LOT_REPOSITORY ]
        },
        {
            provide: DeleteLotUnitPurchaseUseCase,
            useFactory: (lotCheckerPort: LotCheckerPort ,repo: LotUnitPurchaseRepository)=>{
                return new DeleteLotUnitPurchaseUseCase(lotCheckerPort, repo);
            },
            inject: [
                LOT_CHECKER_PORT,
                LOT_UNIT_PURCHASE_REPOSITORY
            ]
        }
    ],
    controllers: [
        LotController
    ],
    exports: [
        LOT_CHECKER_PORT
    ]
})
export class LotModule{}