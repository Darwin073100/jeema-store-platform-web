export const CATEGORY_CHECKER_PORT = Symbol('CATEGORY_CHECKER_PORT');

export interface CategoryCheckerPort {
  /**
   * @param categoryId El ID de la categoría a verificar.
   * @return True si la categoría existe, false en caso contrario.
   */
  exists(categoryId: bigint): Promise<boolean>;
}