import { DataSource, Repository } from "typeorm";
import { CustomerOrmEntity } from "../entities/customer.orm-entity";
import { CustomerCheckerPort } from "../../../../domain/ports/out/customer-checker-port";

export class CustomerCheckerAdapter implements CustomerCheckerPort {
    private readonly repository: Repository<CustomerOrmEntity>
    constructor(
        private readonly datasource: DataSource
    ){
        this.repository = this.datasource.getRepository(CustomerOrmEntity);
    }

    public async existById(customerId: bigint): Promise<boolean> {
        return await this.repository.exists({
            where: {
                customerId
            }
        });
    }    
}