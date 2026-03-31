import { PaymentMethodEntity } from "../../domain/entities/payment-method-entity";
import { IPaymentMethod } from "../../presentation/interfaces/IPaymentMethod";
import { PaymentMethodResponseDto } from "../dtos/payment-method-response.dto";

export class PaymentMethodMapper {
  /**
   * Convierte una entidad de dominio PaymentMethod a un DTO de respuesta.
   *
   * @param entity La entidad PaymentMethod a mapear.
   * @returns Un PaymentMethodResponseDto.
   */
  public static toResponseDto(entity: PaymentMethodEntity): PaymentMethodResponseDto {
    return new PaymentMethodResponseDto(
      entity.paymentMethodId.toString(), // Convertimos BigInt a string para la serialización JSON
      entity.name.name,
      entity.createdAt,
      entity.updatedAt,
      entity.deletedAt,
      entity.requiresReference
    );
  }
  public static toIResponse(entity: PaymentMethodEntity): IPaymentMethod {
    return {
      paymentMethodId: entity.paymentMethodId, // Convertimos BigInt a string para la serialización JSON
      name: entity.name.name,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      deletedAt: entity.deletedAt,
      requiresReference: entity.requiresReference
    };
  }
}
