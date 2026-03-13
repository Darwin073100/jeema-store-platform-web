import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { InventoryOrmEntity } from "./infraestructure/persistence/typeorm/entities/inventory.orm-entity";
import { ProductModule } from "src/contexts/product-management/product/product.module";
import { BranchOfficeModule } from "src/contexts/establishment-management/branch-office/branch-office.module";
import { LotModule } from "src/contexts/purchase-management/lot/lot.module";
import { INVENTORY_REPOSITORY, InventoryRepository } from "./domain/repositories/inventory.repository";
import { TypeormInventoryRepository } from "./infraestructure/persistence/typeorm/repositories/typeorm-inventory.repository";
import { RegisterInventoryUseCase } from "./application/use-case/register-inventory.use-case";
import { PRODUCT_CHECKER_PORT, ProductCheckerPort } from "src/contexts/product-management/product/domain/ports/out/product-checker.port";
import { BRANCH_OFFICE_CHECKER_PORT, BranchOfficeCheckerPort } from "src/contexts/establishment-management/branch-office/domain/ports/out/branch-office-checker.port";
import { InventoryController } from "./presentation/controllers/inventory.controller";
import { ViewAllInventoryUseCase } from "./application/use-case/view-all-inventory.use-case";
import { INVENTORY_CHECKER_PORT, InventoryCheckerPort } from "./domain/port/out/inventory-ckecker.port";
import { InventoryCheckerAdapter } from "./infraestructure/persistence/typeorm/external-services/inventory-checker.adapter";
import { UpdateInventoryUseCase } from "./application/use-case/update-inventory.use-case";
import { DeleteInventoryUseCase } from "./application/use-case/delete-inventory.use-case";
import { FindByInternalBarCodeInventoryUseCase } from "./application/use-case/find-by-internal-barcode-inventory.use-case";
import { InventoryItemOrmEntity } from "../inventory-item/infraestructure/persistence/typeorm/entities/inventory-item.orm-entity";
import { INVENTORY_ITEM_REPOSITORY, InventoryItemRepository } from "../inventory-item/domain/repositories/inventory-item.repository";
import { TypeormInventoryItemRepository } from "../inventory-item/infraestructure/persistence/typeorm/repositories/typeorm-inventory-item.repository";
import { RegisterInventoryItemUseCase } from "../inventory-item/application/use-case/register-inventory-item.use-case";
import { UpdateInventoryItemUseCase } from "../inventory-item/application/use-case/update-inventory-item.use-case";
import { ViewAllInventoryItemUseCase } from "../inventory-item/application/use-case/view-all-inventory-item.use-case";
import { DeleteInventoryItemUseCase } from "../inventory-item/application/use-case/delete-inventory-item.use-case";
import { InventoryItemController } from "../inventory-item/presentation/controllers/inventory-item.controller";
import { FindByLocationItemUseCase } from "../inventory-item/application/use-case/find-by-location-item.use-case";
import { FindByLocationAndBranchOfficeItemUseCase } from "../inventory-item/application/use-case/find-by-location-and-branch-office-item.use-case";
import { BRANCH_OFFICE_REPOSITORY, BranchOfficeRepository } from "src/contexts/establishment-management/branch-office/domain/repositories/branch-office.repository";
import { EditInventoryItemUseCase } from "../inventory-item/application/use-case/edit-inventory-item.use-case";
import { AddInventoryItemUseCase } from "../inventory-item/application/use-case/add-inventory-item.use-case";
import { DiscountInventoryItemUseCase } from "../inventory-item/application/use-case/discount-inventory-item.use-case";
import { ConnectionDBModule } from "src/config/database/typeorm/connection/connection-db.module";
import { GenerateBarcodeUseCase } from "./application/use-case/generate-barcode.use-case";
import { PRODUCT_REPOSITORY, ProductRepository } from "src/contexts/product-management/product/domain/repositories/product.repository";

@Module({
    imports: [
        TypeOrmModule.forFeature([InventoryOrmEntity, InventoryItemOrmEntity]),
        ProductModule,
        BranchOfficeModule,
        LotModule,
        ConnectionDBModule,
    ],
    providers: [
        {
            provide: INVENTORY_REPOSITORY,
            useClass: TypeormInventoryRepository
        },
        {
            provide: INVENTORY_ITEM_REPOSITORY,
            useClass: TypeormInventoryItemRepository
        },
        {
            provide: INVENTORY_CHECKER_PORT,
            useClass: InventoryCheckerAdapter
        },
        {
            provide: RegisterInventoryUseCase,
            useFactory: (repo: InventoryRepository, productCheck:ProductCheckerPort, branchCheck:BranchOfficeCheckerPort)=>{
                return new RegisterInventoryUseCase(repo, productCheck, branchCheck)
            },
            inject:[INVENTORY_REPOSITORY, PRODUCT_CHECKER_PORT, BRANCH_OFFICE_CHECKER_PORT]
        },
        {
            provide: GenerateBarcodeUseCase,
            useFactory: (inventoryRepo: InventoryRepository, productRepo: ProductRepository)=>{
                return new GenerateBarcodeUseCase(inventoryRepo, productRepo)
            },
            inject:[INVENTORY_REPOSITORY, PRODUCT_REPOSITORY]
        },
        {
            provide: UpdateInventoryUseCase,
            useFactory: (repo: InventoryRepository, productCheck:ProductCheckerPort, branchCheck:BranchOfficeCheckerPort)=>{
                return new UpdateInventoryUseCase(repo, productCheck, branchCheck)
            },
            inject:[INVENTORY_REPOSITORY, PRODUCT_CHECKER_PORT, BRANCH_OFFICE_CHECKER_PORT]
        },
        {
            provide: ViewAllInventoryUseCase,
            useFactory: (repository: InventoryRepository)=>{
                return new ViewAllInventoryUseCase(repository);
            },
            inject:[INVENTORY_REPOSITORY]
        },
        {
            provide: FindByInternalBarCodeInventoryUseCase,
            useFactory: (repository: InventoryRepository)=>{
                return new FindByInternalBarCodeInventoryUseCase(repository);
            },
            inject:[INVENTORY_REPOSITORY]
        },
        {
            provide: DeleteInventoryUseCase,
            useFactory: (repository: InventoryRepository)=>{
                return new DeleteInventoryUseCase(repository);
            },
            inject:[INVENTORY_REPOSITORY]
        },
        {
            provide: RegisterInventoryItemUseCase,
            useFactory: (repo: InventoryItemRepository, inventoryCheck: InventoryCheckerPort)=>{
                return new RegisterInventoryItemUseCase(repo, inventoryCheck)
            },
            inject:[INVENTORY_ITEM_REPOSITORY, INVENTORY_CHECKER_PORT]
        },
        {
            provide: UpdateInventoryItemUseCase,
            useFactory: (repo: InventoryItemRepository, inventoryCheck: InventoryCheckerPort)=>{
                return new UpdateInventoryItemUseCase(repo, inventoryCheck)
            },
            inject:[INVENTORY_ITEM_REPOSITORY, INVENTORY_CHECKER_PORT]
        },
        {
            provide: ViewAllInventoryItemUseCase,
            useFactory: (repository: InventoryItemRepository)=>{
                return new ViewAllInventoryItemUseCase(repository);
            },
            inject:[INVENTORY_ITEM_REPOSITORY]
        },
        {
            provide: AddInventoryItemUseCase,
            useFactory: (repository: InventoryItemRepository)=>{
                return new AddInventoryItemUseCase(repository);
            },
            inject:[INVENTORY_ITEM_REPOSITORY]
        },
        {
            provide: DiscountInventoryItemUseCase,
            useFactory: (repository: InventoryItemRepository)=>{
                return new DiscountInventoryItemUseCase(repository);
            },
            inject:[INVENTORY_ITEM_REPOSITORY]
        },
        {
            provide: EditInventoryItemUseCase,
            useFactory: (repository: InventoryItemRepository)=>{
                return new EditInventoryItemUseCase(repository);
            },
            inject:[INVENTORY_ITEM_REPOSITORY]
        },
        {
            provide: DeleteInventoryItemUseCase,
            useFactory: (repository: InventoryItemRepository)=>{
                return new DeleteInventoryItemUseCase(repository);
            },
            inject:[INVENTORY_ITEM_REPOSITORY]
        },
        {
            provide: FindByLocationItemUseCase,
            useFactory: (inventoryRepo: InventoryRepository, itemRepo: InventoryItemRepository)=>{
                return new FindByLocationItemUseCase(inventoryRepo, itemRepo);
            },
            inject:[ INVENTORY_REPOSITORY, INVENTORY_ITEM_REPOSITORY]
        },
        {
            provide: FindByLocationAndBranchOfficeItemUseCase,
            useFactory: (branchOfficeRepo: BranchOfficeRepository, itemRepo: InventoryItemRepository)=>{
                return new FindByLocationAndBranchOfficeItemUseCase(branchOfficeRepo, itemRepo);
            },
            inject:[ BRANCH_OFFICE_REPOSITORY, INVENTORY_ITEM_REPOSITORY]
        }
    ],
    controllers: [
        InventoryController,
        InventoryItemController
    ],
    exports: [
        INVENTORY_CHECKER_PORT,
        INVENTORY_REPOSITORY,
        INVENTORY_ITEM_REPOSITORY,
        DiscountInventoryItemUseCase,
        AddInventoryItemUseCase,
        DiscountInventoryItemUseCase,
    ]
})
export class InventoryModule{}