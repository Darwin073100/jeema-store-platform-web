export const PRODUCT_CHECKER_PORT = Symbol('PRODUCT_CHECKER_PORT');

export interface ProductCheckerPort{
    check(productId: bigint):Promise<boolean>;
}