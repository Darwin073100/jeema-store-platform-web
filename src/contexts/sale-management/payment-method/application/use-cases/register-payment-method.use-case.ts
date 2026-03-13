import { PaymentMethodEntity } from "../../domain/entities/payment-method-entity";
import { PaymentMethodRepository } from "../../domain/repositories/payment-method.repository";
import { PaymentMethodNameVO } from "../../domain/value-objects/payment-method-name.vo";
import { RegisterPaymentMethodDto } from "../dtos/register-payment-method.dto";

export class RegisterPaymentMethodUseCase {
  constructor(
    private readonly repository: PaymentMethodRepository,
  ) {}

  public async execute(command: RegisterPaymentMethodDto): Promise<PaymentMethodEntity> {
    const name = PaymentMethodNameVO.create(command.name);
    const requiresReference = command.requiresReference;
    const createdPaymentMethod = PaymentMethodEntity.create(name,requiresReference);

    // Persistir el agregado de dominio a través del repositorio (Puerto de Salida).
    const savedEntity = await this.repository.save(createdPaymentMethod);
    return savedEntity;
  }
}