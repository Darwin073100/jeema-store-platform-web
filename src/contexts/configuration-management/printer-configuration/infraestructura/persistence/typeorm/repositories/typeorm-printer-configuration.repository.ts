import { DataSource, Repository } from "typeorm";
import { PrinterConfigurationOrmEntity } from "../entities/printer-configuration.orm-entity";
import { PrinterConfigurationMapper } from "../mappers/printer-configuration.mapper";
import { PrinterConfigurationRepository } from "src/contexts/configuration-management/printer-configuration/domain/repositories/printer-configuration.repository";
import { PrinterConfigurationEntity } from "src/contexts/configuration-management/printer-configuration/domain/entities/printer-configuration.entity";
import { PrinterConfigurationNotFoundException } from "src/contexts/configuration-management/printer-configuration/domain/exceptions/printer-configuration-not-found.exception";
import { getDataSource } from "@/configuration/databases/typeorm/config";

export class TypeormPrinterConfigurationRepository implements PrinterConfigurationRepository {
    private readonly typeormRepository: Repository<PrinterConfigurationOrmEntity>;
    constructor(private readonly datasource: DataSource) {
        this.typeormRepository = this.datasource.getRepository(PrinterConfigurationOrmEntity);
    }

    /**
     * Crea una instancia del repositorio (factory)
     * Uso: const repo = await TypeormPrinterConfigurationRepository.create();
     */
    static async create(): Promise<TypeormPrinterConfigurationRepository> {
        const dataSource = await getDataSource();
        return new TypeormPrinterConfigurationRepository(dataSource);
    }

    async findById(printerConfigurationId: bigint): Promise<PrinterConfigurationEntity | null> {
        const ormEntity = await this.typeormRepository.findOne({
            where: { printerConfigurationId },
        });
        if (!ormEntity) {
            return null;
        }
        return PrinterConfigurationMapper.toDomainEntity(ormEntity);
    }

    async findByBranchOffice(branchOfficeId: bigint): Promise<PrinterConfigurationEntity[]> {
        const result = await this.typeormRepository.find({
            where: { branchOfficeId },
            order: { createdAt: 'ASC' },
        });
        return result.map(item => PrinterConfigurationMapper.toDomainEntity(item));
    }

    async save(entity: PrinterConfigurationEntity): Promise<PrinterConfigurationEntity> {
        const ormEntity = PrinterConfigurationMapper.toTypeOrmEntity(entity);
        const savedOrmEntity = await this.typeormRepository.save(ormEntity);
        return PrinterConfigurationMapper.toDomainEntity(savedOrmEntity);
    }

    async update(entity: PrinterConfigurationEntity): Promise<PrinterConfigurationEntity> {
        const existingOrmEntity = await this.typeormRepository.findOne({
            where: { printerConfigurationId: entity.printerConfigurationId },
        });

        if (!existingOrmEntity) {
            throw new PrinterConfigurationNotFoundException('Configuración de impresora no encontrada.');
        }

        const ormEntity = PrinterConfigurationMapper.toTypeOrmEntity(entity);
        const savedOrmEntity = await this.typeormRepository.save(ormEntity);
        return PrinterConfigurationMapper.toDomainEntity(savedOrmEntity);
    }
}
