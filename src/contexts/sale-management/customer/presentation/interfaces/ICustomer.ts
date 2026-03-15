import { IAddress } from "@/contexts/establishment-management/address/presentation/interfaces/IAddress";
import { IEstablishment } from "@/contexts/establishment-management/establishment/presentation/interfaces/IEstablishment";
import { ISale } from "@/contexts/sale-management/sale/presentation/interfaces/ISale";

export interface ICustomer {
  customerId: bigint,
  firstName: string,
  saleDefault: boolean,
  establishmentId: bigint | null,
  lastName: string | null,
  companyName: string | null,
  addressId: bigint | null,
  phoneNumber: string | null,
  rfc: string | null,
  email: string | null,
  customerType: string | null,
  createdAt: Date,
  updatedAt: Date | null,
  deletedAt: Date | null,
  address: IAddress | null,
  establishment: IEstablishment | null,
  sales: ISale[],
}
