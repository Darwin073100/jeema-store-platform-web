import { ProductMapper } from 'src/contexts/product-management/product/application/mappers/product.mapper';
import { LotEntity } from '../../domain/entities/lot.entity';
import { LotResponseDto } from '../dtos/lot-response.dto';
import { LotUnitPurchaseMapper } from './lot-unit-purchase.mapper';
import { SuplierMapper } from 'src/contexts/purchase-management/suplier/application/mappers/suplier.mapper';

export class LotMapper {
  static toResponseDto(lot: LotEntity): LotResponseDto {
    return {
      lotId: lot.lotId.toString(),
      productId: lot.productId.toString(),
      suplierId: lot.suplierId?.toString() ?? null,
      lotNumber: lot.lotNumber,
      purchasePrice: lot.purchasePrice,
      initialQuantity: lot.initialQuantity,
      purchaseUnit: lot.purchaseUnit,
      expirationDate: lot.expirationDate ?? null,
      manufacturingDate: lot.manufacturingDate ?? null,
      receivedDate: lot.receivedDate,
      product: lot.product? ProductMapper.toResponseDto(lot.product): null,
      lotUnitPurchases: lot.lotUnitPurchases ? lot.lotUnitPurchases.map(item => LotUnitPurchaseMapper.toResponseDTO(item)) : [],
      suplier: lot.suplier? SuplierMapper.toResponseDto(lot.suplier): null,
      createdAt: lot.createdAt,
      updatedAt: lot.updatedAt ?? null,
      deletedAt: lot.deletedAt ?? null,
    };
  }
}
