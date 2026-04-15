/**
 * Este DTO es para editar la información de un cliente.
 */
export interface UpdateCustomerDto {
    readonly customerId: bigint;
    readonly firstName?: string;
    readonly saleDefault?: boolean;
    readonly lastName?: string|null;
    readonly companyName?: string|null;
    readonly phoneNumber?: string|null;
    readonly rfc?: string | null;
    readonly email?: string | null;
    readonly customerType?: string | null;
}