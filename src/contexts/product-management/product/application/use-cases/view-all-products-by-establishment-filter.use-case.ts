import { ProductEntity } from "../../domain/entities/product.entity";
import { ProductRepository } from "../../domain/repositories/product.repository";
import { FilterProductListDTO } from "../dtos/filter-product-list.dto";

export class ViewAllProductsByEstablishmentFilterUseCase {
  constructor(private readonly productRepository: ProductRepository) {}

  async execute(establishmentId: bigint, dto: FilterProductListDTO): Promise<ProductEntity[]> {
    const universalBarcodeResult = await this.productRepository.findAllByEstablishmentAndName(establishmentId, {universalBarcode: dto.universalBarcode});
    const internalBarcodeResult = await this.productRepository.findAllByEstablishmentAndName(establishmentId, {internalBarcode: dto.internalBarcode});
    const productResult = await this.productRepository.findAllByEstablishmentAndName(establishmentId, {product: dto.product});
    const categoryResult = await this.productRepository.findAllByEstablishmentAndName(establishmentId, {category: dto.category});
    const data = new Set([
      ...universalBarcodeResult,
      ...internalBarcodeResult,
      ...productResult,
      ...categoryResult
    ])
    return [
      ...data
    ]
  }
}
