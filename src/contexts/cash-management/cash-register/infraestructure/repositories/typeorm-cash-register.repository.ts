import { DataSource, Repository } from "typeorm";
import { CashRegisterEntity } from "../../domain/entities/cash-register.entity";
import { CashRegisterRepository } from "../../domain/repositories/cash-register.repository";
import { CashRegisterOrmEntity } from "../entities/cash-register.orm-entity";
import { CashRegisterMapper } from "../mappers/cash-register.mapper";
import { getDataSource } from "@/configuration/databases/typeorm/config";

export class TypeormCashRegisterRepository implements CashRegisterRepository{
    private readonly repository: Repository<CashRegisterOrmEntity>;
    constructor(
        private readonly datasource: DataSource
    ){
        this.repository = this.datasource.getRepository(CashRegisterOrmEntity);
    }

    /**
     * Crea una instancia del repositorio (factory)
     * Uso: const repo = await TypeOrmAgregadoRepository.create();
     */
    static async create(): Promise<TypeormCashRegisterRepository> {
        const dataSource = await getDataSource();
        return new TypeormCashRegisterRepository(dataSource);
    }
    
    async save(entity: CashRegisterEntity): Promise<CashRegisterEntity> {
        try {
            let cashExist = await this.repository.findOne({
                where: {
                    cashRegisterId: entity.cashRegisterId
                }
            });
            if(cashExist){
                cashExist = {
                    ...cashExist,
                    name: entity.name,
                    isActive: entity.isActive
                }
                const updateResult = await this.repository.save(cashExist);
                return CashRegisterMapper.toDomain(updateResult); 
            }
            const ormEntity = CashRegisterMapper.toOrm(entity);
            const saveResult = await this.repository.save(ormEntity);
            return CashRegisterMapper.toDomain(saveResult);
        } catch (error) {
            throw error;
        }
    }

    async existById(cashRegisterId: bigint): Promise<boolean> {
        return await this.repository.existsBy({
            cashRegisterId
        });
    }
    findAll(): Promise<[] | CashRegisterEntity[]> {
        throw new Error('Method not implements');
    }
    async findAllByBranchOfficeId(branchOfficeId: bigint): Promise<CashRegisterEntity[]> {
        const result = await this.repository
            .createQueryBuilder('cr')
            // Agregamos la condición WHERE para la sucursal
            .where('cr.branch_office_id = :branchId', { branchId: branchOfficeId }) 
            
            // Mantenemos el LEFT JOIN condicional para la sesión abierta
            .leftJoinAndSelect(
                'cr.cashSessions', // Usando la relación definida en tu entidad
                'cs',
                'cs.is_closed = :isClosed', 
                { isClosed: false }
            )            
            .orderBy('cr.cash_register_id', 'ASC')
            .getMany();
        if(!result){
            return Promise.resolve([]);
        }

        return result.map(item => CashRegisterMapper.toDomain(item));
    }
    async findById(entityId: bigint): Promise<CashRegisterEntity | null> {
        const result =  await this.repository.findOne({
            where: {
                cashRegisterId: entityId,
            },
            relations: {
                branchOffice: {
                    address: true
                }
            }
        });
        return result? CashRegisterMapper.toDomain(result): result;
    }
    findSessionsByBranchOfficeId(entityId: bigint): Promise<CashRegisterEntity | null> {
        throw new Error('Method not implements');
    }
    delete(entityId: bigint): Promise<CashRegisterEntity | null> {
        throw new Error('Method not implements');
    }
}