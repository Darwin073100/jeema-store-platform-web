/**
 * Nombres exactos (case-insensitive vía TransactionTypeRepository.findByName) de los `transaction_type`
 * sembrados en `initial-data-postgres-script.sql`, usados por los casos de uso que necesitan resolver un
 * `transactionTypeId` a partir de un nombre en vez de un id hardcodeado. Centralizados aquí para no repetir
 * el mismo string mágico entre `register-sale-payment.use-case.ts` y `register-credit-payment.use-case.ts`.
 */
export const SALE_PAYMENT_TRANSACTION_TYPE_NAME = 'Ingreso por Venta de Mercancía';
export const CREDIT_PAYMENT_TRANSACTION_TYPE_NAME = 'Abono a un Credito';
