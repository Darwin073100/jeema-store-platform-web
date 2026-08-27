import { PrinterConfigurationEntity } from "src/contexts/configuration-management/printer-configuration/domain/entities/printer-configuration.entity";
import { PaperWidthVO } from "src/contexts/configuration-management/printer-configuration/domain/value-objects/paper-width.vo";
import { PrinterConnectionTypeVO } from "src/contexts/configuration-management/printer-configuration/domain/value-objects/printer-connection-type.vo";
import { PrinterConfigurationOrmEntity, PrinterConnectionTypeOrmEnum } from "../entities/printer-configuration.orm-entity";

export class PrinterConfigurationMapper {
    // Domain to TypeORM
    static toTypeOrmEntity(domainEntity: PrinterConfigurationEntity): PrinterConfigurationOrmEntity {
        const typeOrmEntity = new PrinterConfigurationOrmEntity();
        typeOrmEntity.printerConfigurationId = domainEntity.printerConfigurationId;
        typeOrmEntity.branchOfficeId = domainEntity.branchOfficeId;
        typeOrmEntity.label = domainEntity.label;
        typeOrmEntity.connectionType = domainEntity.connectionType.value as unknown as PrinterConnectionTypeOrmEnum;
        typeOrmEntity.target = domainEntity.target;
        typeOrmEntity.paperWidthMm = domainEntity.paperWidth.value;
        typeOrmEntity.autoPrintOnSale = domainEntity.autoPrintOnSale;
        typeOrmEntity.openCashDrawer = domainEntity.openCashDrawer;
        typeOrmEntity.copies = domainEntity.copies;
        typeOrmEntity.isActive = domainEntity.isActive;
        typeOrmEntity.createdAt = domainEntity.createdAt;
        typeOrmEntity.updatedAt = domainEntity.updatedAt;
        return typeOrmEntity;
    }

    // TypeORM to Domain
    static toDomainEntity(typeOrmEntity: PrinterConfigurationOrmEntity): PrinterConfigurationEntity {
        return PrinterConfigurationEntity.reconstitute(
            typeOrmEntity.printerConfigurationId,
            typeOrmEntity.branchOfficeId,
            typeOrmEntity.label,
            PrinterConnectionTypeVO.create(typeOrmEntity.connectionType),
            typeOrmEntity.target,
            PaperWidthVO.create(typeOrmEntity.paperWidthMm),
            typeOrmEntity.autoPrintOnSale,
            typeOrmEntity.openCashDrawer,
            typeOrmEntity.copies,
            typeOrmEntity.isActive,
            typeOrmEntity.createdAt,
            typeOrmEntity.updatedAt,
        );
    }
}
