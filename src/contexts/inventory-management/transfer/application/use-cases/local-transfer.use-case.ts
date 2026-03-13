import { LocalTransferDTO } from "../dtos/local-transfer.dto";
import { InventoryRepository } from "src/contexts/inventory-management/inventory/domain/repositories/inventory.repository";
import { TransferRepository } from "../../domain/repositories/transfer.repository";
import { InventoryItemRepository } from "src/contexts/inventory-management/inventory-item/domain/repositories/inventory-item.repository";
import { EmployeeRepository } from "src/contexts/employee-management/employee/domain/repositories/employee.repository";
import { BranchOfficeRepository } from "src/contexts/establishment-management/branch-office/domain/repositories/branch-office.repository";
import { TransferNotFoundException } from "../../domain/exceptions/transfer-not-found.exception";
import { TransferConflictException } from "../../domain/exceptions/transfer-conflict.exception";
import { InventoryItemEntity } from "src/contexts/inventory-management/inventory-item/domain/entities/inventory-item.entity";
import { InventoryItemQuantityOnHandVO } from "src/contexts/inventory-management/inventory-item/domain/value-objects/inventory-item-quantity-on-hand.vo";
import { AddInventoryItemUseCase } from "src/contexts/inventory-management/inventory-item/application/use-case/add-inventory-item.use-case";
import { DiscountInventoryItemUseCase } from "src/contexts/inventory-management/inventory-item/application/use-case/discount-inventory-item.use-case";
import { TransferEntity } from "../../domain/entities/transafer.entity";
import { TransferStatusEnum } from "../../domain/enums/transfer-status.enum";

export class LocalTransferUseCase {
    constructor(
        private readonly transferRepository: TransferRepository,
        private readonly inventoryRepository: InventoryRepository,
        private readonly inventoryItemRepository: InventoryItemRepository,
        private readonly employeeRepository: EmployeeRepository,
        private readonly branchOfficeRepository: BranchOfficeRepository,
        private readonly addInventoryItemUseCase: AddInventoryItemUseCase,
        private readonly removeIncentoryItemUseCase: DiscountInventoryItemUseCase
    ) {}

    async execute(command: LocalTransferDTO){
        //* Si viene el id del inventario, lo buscamos directamente en la base de datos.
        const isInventory = await this.inventoryRepository.existById(command.inventoryId);
        if(!isInventory){
            throw new TransferNotFoundException(`El inventario con id ${command.inventoryId} no existe.`);
        }
        //* Verificamos si el id del empleado que hace el movimeinto existe. 
        const isEmployee = await this.employeeRepository.existById(command.requestedByEmployeeId);
        if(!isEmployee){
            throw new TransferNotFoundException(`El empleado con id ${command.inventoryId} no existe.`);
        }
        //* Verificamos si el id de la sucursal que hace el movimiento existe. 
        const isBranchOffice = await this.branchOfficeRepository.existById(command.branchOfficeId);
        if(!isBranchOffice){
            throw new TransferNotFoundException(`La sucursal con id ${command.inventoryId} no existe.`);
        }
        //* Verificamso si está aperturada la ubicación de donde se desea traspasar.
        const fromLocationExist = await this.inventoryItemRepository.findByLocation(command.inventoryId, command.fromLocation);
        if(!fromLocationExist){
            throw new TransferNotFoundException(`El inventario con id ${command.inventoryId} no tiene aparturado el inventario de ${command.fromLocation}.`);
        }
        //* Verificamso que haya stock suficiente para traspasar.
        if(fromLocationExist.quantityOnHand.value < command.quantity){
            throw new TransferConflictException(`No tienes suficiente stock, solo puedes traspasar ${fromLocationExist.quantityOnHand.value}.`);
        }
        //* Verificamso si el destino del stock existe, caso contrario, se crea y se asigna el stock traspasado.
        let toLocationExist: InventoryItemEntity | null = await this.inventoryItemRepository.findByLocation(command.inventoryId, command.toLocation);
        if(!toLocationExist){
            const newLocation = InventoryItemEntity.create(command.inventoryId, command.toLocation, InventoryItemQuantityOnHandVO.create(0));
            toLocationExist = await this.inventoryItemRepository.save(newLocation);
        }

        const removeInventory = await this.removeIncentoryItemUseCase.execute(fromLocationExist.inventoryItemId, command.quantity);
        const addInventory = await this.addInventoryItemUseCase.execute(toLocationExist.inventoryItemId, command.quantity);

        const transfer = TransferEntity.create(
            command.inventoryId,
            command.branchOfficeId,
            command.fromLocation,
            command.branchOfficeId,
            command.toLocation,
            command.quantity,
            command.quantity,
            command.requestedByEmployeeId,
            command.requestedByEmployeeId,
            command.requestedByEmployeeId,
            command.requestedByEmployeeId,
            new Date(),
            new Date(),
            new Date(),
            TransferStatusEnum.RECEIVED,
            command.notes
        );

        const result = await this.transferRepository.save(transfer);
        return result;

    }
}