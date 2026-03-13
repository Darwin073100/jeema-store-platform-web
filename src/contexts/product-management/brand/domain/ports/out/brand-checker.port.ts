export const BRAND_CHECKER_PORT = Symbol('BRAND_CHECKER_PORT');
export interface BrandChekerPort{
    /**
     * @param brandId El ID de la marca a verificar.
     * @return True si la marca existe, false en caso contrario.
     */
    exists(brandId: bigint): Promise<boolean>;
}