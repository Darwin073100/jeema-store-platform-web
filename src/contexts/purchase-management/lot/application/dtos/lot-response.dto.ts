import { ProductResponseDto } from "src/contexts/product-management/product/application/dtos/product-response.dto";
import { LotUnitPurchaseResponseDTO } from "./lot-unit-purchase-response.dto";
import { ForSaleEnum } from "src/shared/domain/enums/for-sale.enum";
import { SuplierResponseDto } from "src/contexts/purchase-management/suplier/application/dtos/suplier-response.dto";

export class LotResponseDto {
  lotId: string;
  productId: string;
  suplierId: string | null;
  lotNumber: string;
  purchasePrice: number;
  purchaseUnit: ForSaleEnum;
  initialQuantity: number;
  expirationDate: Date | null;
  manufacturingDate: Date | null;
  product: ProductResponseDto | null;
  lotUnitPurchases: LotUnitPurchaseResponseDTO[];
  suplier: SuplierResponseDto | null;
  receivedDate: Date;
  createdAt: Date;
  updatedAt: Date | null;
  deletedAt: Date | null;
}
