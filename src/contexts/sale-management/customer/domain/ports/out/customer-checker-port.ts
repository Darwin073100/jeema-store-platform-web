export const CUSTOMER_CHECKER_PORT = Symbol('CUSTOMER_CHECKER_PORT');

export interface CustomerCheckerPort {
  existById(customerId: bigint): Promise<boolean>;
}