import { PaymentMethodEntity } from "../../domain/entities/payment-method-entity";
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
}
