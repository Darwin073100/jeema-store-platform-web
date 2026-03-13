import { Inject, Injectable } from "@nestjs/common";
import { CashSessionEntity } from "../../domain/entities/cash-session.entity";
import { CashSessionRepository } from "../../domain/repositories/cash-session.repository";
import { Between, DataSource, Repository } from "typeorm";
import { CashSessionOrmEntity } from "../entities/cash-session.orm-entity";
import { CashSessionMapper } from "../mappers/cash-session.mapper";
import { CONNECTION_DB_REPOSITORIO, ConnectionDBRepository } from "src/config/database/typeorm/connection/domain/repositories/connection-repository";

@Injectable()
export class TypeormCashSessionRepository implements CashSessionRepository {
    private readonly repository: Repository<CashSessionOrmEntity>;
    
    constructor(
        private readonly datasource: DataSource,
        @Inject(CONNECTION_DB_REPOSITORIO)
        private readonly connection: ConnectionDBRepository
    ){
        this.repository = this.datasource.getRepository(CashSessionOrmEntity);
    }
    async save(entity: CashSessionEntity): Promise<CashSessionEntity> {
        let cashSessionExist = await this.repository.findOneBy({
            cashSessionId: entity.cashSessionId
        });
        if(cashSessionExist){
            cashSessionExist = {
                ...cashSessionExist,
                startBalance: entity.startBalance,
                startTime: entity.startTime,
                endTime: entity.endTime,
                expectedBalance: entity.expectedBalance,
                actualBalance: entity.actualBalance,
                diference: entity.diference,
                isClosed: entity.isClosed,
                closingNotes: entity.closingNotes,
                cashRegisterId: entity.cashRegisterId,
                employeeId: entity.employeeId,
            }
            const updateResult = await this.connection.getManager().save(CashSessionOrmEntity, cashSessionExist);
            return CashSessionMapper.toDomain(updateResult);
        }
        const ormEntity = CashSessionMapper.toOrm(entity);
        const saveRessult = await this.connection.getManager().save(CashSessionOrmEntity, ormEntity);
        return CashSessionMapper.toDomain(saveRessult);
    }

    async findByEmployeeId(employeeId: bigint):Promise<CashSessionEntity | null>{
        const result = await this.repository.find({
            where: {
                employeeId,
                isClosed: false
            },
            relations: {
                cashRegister: true
            }
        });
        if(result.length <= 0){
            return null;
        }
        return CashSessionMapper.toDomain(result[0]);
    }

    async findCashSessionWitTransactions(cashSessionId: bigint): Promise<CashSessionEntity|null>{
        const result = await this.repository.findOne({
            where: {
                cashSessionId,
            },
            relations: {
                employee: true,
                transactions: {
                    transactionType: true
                },
                cashRegister: true
            }
        });
        if(!result){
            return null;
        }
        return CashSessionMapper.toDomain(result);
    }
    async findCashSessionTicket(cashSessionId: bigint): Promise<CashSessionEntity|null>{
        const result = await this.repository.findOne({
            where: {
                cashSessionId,
            },
            relations: {
                employee: true,
                sales:{
                    salePayments:{
                        paymentMethod: true
                    }
                },
                transactions: {
                    transactionType: true
                },
                cashRegister: {
                    branchOffice:{
                        address: true
                    }
                }
            }
        });
        if(!result){
            return null;
        }
        return CashSessionMapper.toDomain(result);
    }

    async isClosedCashSession(cashRegisterId: bigint): Promise<CashSessionEntity|null>{
        const result = await this.repository.findOneBy({
            cashRegisterId,
            isClosed: false,
        });

        return result? CashSessionMapper.toDomain(result): null;
    }
    async findById(entityId: bigint): Promise<CashSessionEntity | null> {
        const result = await this.repository.findOne({
            where: {
                cashSessionId: entityId
            }
        });
        if(!result){
            return Promise.resolve(null);
        }
        return CashSessionMapper.toDomain(result);
    }
    async existById(entityId: bigint): Promise<CashSessionEntity | null> {
        const result = await this.repository.findOne({
            where: {
                cashSessionId: entityId
            }
        });
        if(!result){
            return Promise.resolve(null);
        }
        return CashSessionMapper.toDomain(result);
    }
    findAll(): Promise<CashSessionEntity[] | []> {
        throw new Error();
    }
    async findAllByBranchOffice(branchOfficeId: bigint, dateInit: Date, dateFinish: Date): Promise<CashSessionEntity[]> {
        const result = await this.repository.find({
            where: {
                cashRegister: {
                    branchOfficeId,
                },
                startTime: Between(dateInit, dateFinish)
            }, 
            order:{
                startTime:{
                    direction: 'DESC'
                }
            },
            relations: {
                cashRegister: true,
                employee: true,
            }
        });
        return result.map(item => CashSessionMapper.toDomain(item));
    }

    async findMovementsByBranchOffice(branchOfficeId: bigint): Promise<CashSessionEntity[]> {
        const result = await this.repository.find({
            where: {
                cashRegister: {
                    branchOfficeId
                },
            }, 
            order:{
                startTime:{
                    direction: 'DESC'
                }
            },
            relations: {
                cashRegister: true,
                employee: true,
            }
        });
        return result.map(item => CashSessionMapper.toDomain(item));
    }
    delete(entityId: bigint): Promise<CashSessionEntity | null> {
        throw new Error("Method not implemented.");
    }

}