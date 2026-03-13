export const SALE_CHECKER_PORT = Symbol('SALE_CHECKER_PORT');

export interface SaleCheckerPort {
  /**
   * @param entityId El ID del metodo de pago a verificar.
   * @return True si el metodo de pago existe, false en caso contrario.
   */
  existById(entityId: bigint): Promise<boolean>;
}