export const PAYMENT_METHOD_CHECKER_PORT = Symbol('PAYMENT_METHOD_CHECKER_PORT');

export interface PaymentMethodCheckerPort {
  /**
   * @param entityId El ID del metodo de pago a verificar.
   * @return True si el metodo de pago existe, false en caso contrario.
   */
  exists(entityId: bigint): Promise<boolean>;
}