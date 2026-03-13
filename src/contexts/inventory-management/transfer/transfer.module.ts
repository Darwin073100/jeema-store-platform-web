import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TransferOrmEntity } from "./infraestructure/entities/transfer.orm-entity";
import { TRANSFER_REPOSITORY, TransferRepository } from "./domain/repositories/transfer.repository";
import { TypeormTransferRepository } from "./infraestructure/repositories/typeorm-transfer.repository";
import { LocalTransferUseCase } from "./application/use-cases/local-transfer.use-case";
import { INVENTORY_REPOSITORY, InventoryRepository } from "../inventory/domain/repositories/inventory.repository";
import { INVENTORY_ITEM_REPOSITORY, InventoryItemRepository } from "../inventory-item/domain/repositories/inventory-item.repository";
import { EMPLOYEE_REPOSITORY, EmployeeRepository } from "src/contexts/employee-management/employee/domain/repositories/employee.repository";
import { BRANCH_OFFICE_REPOSITORY, BranchOfficeRepository } from "src/contexts/establishment-management/branch-office/domain/repositories/branch-office.repository";
import { AddInventoryItemUseCase } from "../inventory-item/application/use-case/add-inventory-item.use-case";
import { DiscountInventoryItemUseCase } from "../inventory-item/application/use-case/discount-inventory-item.use-case";
import { InventoryModule } from "../inventory/inventory.module";
import { EmployeeModule } from "src/contexts/employee-management/employee/employee.module";
import { BranchOfficeModule } from "src/contexts/establishment-management/branch-office/branch-office.module";
import { TransferController } from "./presentation/controllers/transfer.controller";
import { FindAllTransferByBranchOfficeUseCase } from "./application/use-cases/find-all-transfer-by-branch-office.use-case";

@Module({
    imports: [
        TypeOrmModule.forFeature([ TransferOrmEntity ]),
        InventoryModule,
        EmployeeModule,
        BranchOfficeModule,
    ],
    providers: [
        {
            provide: TRANSFER_REPOSITORY,
            useClass: TypeormTransferRepository
        },
        {
            provide: LocalTransferUseCase,
            useFactory: (transferRepository: TransferRepository, inventoryRepository: InventoryRepository, inventoryItemRepository: InventoryItemRepository,
                    employeeRepository: EmployeeRepository, branchOfficeRepository: BranchOfficeRepository,
                    addInventoryItemUseCase: AddInventoryItemUseCase,
                    removeIncentoryItemUseCase: DiscountInventoryItemUseCase)=>{
                        return new LocalTransferUseCase(transferRepository,inventoryRepository,inventoryItemRepository,
                            employeeRepository,branchOfficeRepository,addInventoryItemUseCase,removeIncentoryItemUseCase,
                        );
            },
            inject: [
                TRANSFER_REPOSITORY, INVENTORY_REPOSITORY, INVENTORY_ITEM_REPOSITORY, EMPLOYEE_REPOSITORY, 
                BRANCH_OFFICE_REPOSITORY, AddInventoryItemUseCase, DiscountInventoryItemUseCase
            ]
        },
        {
            provide: FindAllTransferByBranchOfficeUseCase,
            useFactory: (transferRepository: TransferRepository, branchOfficeRepository: BranchOfficeRepository,)=> {
                return new FindAllTransferByBranchOfficeUseCase(transferRepository, branchOfficeRepository);
            },
            inject: [
                TRANSFER_REPOSITORY, BRANCH_OFFICE_REPOSITORY
            ]
        }
    ],
    controllers: [
        TransferController
    ],
    exports: [
        TRANSFER_REPOSITORY
    ],
})
export class TransferModule {}