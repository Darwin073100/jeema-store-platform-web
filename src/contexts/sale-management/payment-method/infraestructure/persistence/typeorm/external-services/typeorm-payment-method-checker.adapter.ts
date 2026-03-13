import { DataSource, Repository } from "typeorm";
import { PaymentMethodOrmEntity } from "../entities/payment-method.orm-entity";
import { PaymentMethodCheckerPort } from "src/contexts/sale-management/payment-method/domain/ports/out/payment-method-checker.port";

export class TypeormPaymentMethodCheckerAdapter implements PaymentMethodCheckerPort {
    private readonly repository: Repository<PaymentMethodOrmEntity>;

    constructor(private readonly datasource: DataSource){
        this.repository = this.datasource.getRepository(PaymentMethodOrmEntity);
    }

    async exists(entityId: bigint): Promise<boolean> {
        const result = await this.repository.existsBy({paymentMethodId: entityId});
        return result;
    }
}