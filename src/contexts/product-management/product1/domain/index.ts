/**
 * Exportaciones de la capa de Dominio para Producto
 */
export { ProductEntity } from './entities/product.entity';
export { type ProductRepository, PRODUCT_REPOSITORY } from './repositories/product.repository';
export { ProductValidateException } from './exceptions/product-validate.exception';
export { ProductNotFoundException } from './exceptions/product-not-found.exception';
export { ProductNameVO } from './value-objects/product-name.vo';
export { ProductSkuVO } from './value-objects/product-sku.vo';
export { ProductDescriptionVO } from './value-objects/product-description.vo';
export { ProductUniversalBarCodeVO } from './value-objects/product-universal-bar-code.vo';
