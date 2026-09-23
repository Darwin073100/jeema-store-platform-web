import { CloudTransferApiMapper } from "@/contexts/inventory-management/cloud-transfer/infraestructure/http/mappers/cloud-transfer-api.mapper";
import { CloudTransferItemEntity } from "@/contexts/inventory-management/cloud-transfer/domain/entities/cloud-transfer-item.entity";
import { ForSaleEnum } from "@/shared/domain/enums/for-sale.enum";

function buildItem(productImageUrl: string | null) {
    return CloudTransferItemEntity.create({
        cloudTransferId: BigInt(1),
        lineNumber: 1,
        productName: 'Producto de prueba',
        productSku: null,
        productCategoryName: 'Categoria',
        productUnitOfMeasure: ForSaleEnum.PC,
        productImageUrl,
        lotNumber: 'L-1',
        lotPurchasePrice: 10,
        lotPurchaseUnit: ForSaleEnum.PC,
        lotTransferredQuantity: 1,
    });
}

/**
 * `LocalFilesystemImageStorageAdapter` (modo on-premise por defecto de esta tienda) guarda `imageUrl` como
 * ruta relativa (`/uploads/...`), no resoluble desde el servidor de EDYOF. Enviarla tal cual hacía que
 * EDYOF rechazara el traspaso COMPLETO con 400 (`ProductBlockCommand.imageUrl` no es una URL válida) para
 * cualquier producto con imagen — visto en producción. Ver nota en cloud-transfer-api.mapper.ts.
 */
describe('CloudTransferApiMapper.toTransferItemHttpDto — imageUrl', () => {
    it('omite imageUrl cuando es una ruta relativa local (/uploads/...)', () => {
        const dto = CloudTransferApiMapper.toTransferItemHttpDto(buildItem('/uploads/product/42/foto.webp'));
        expect(dto.product.imageUrl).toBeUndefined();
    });

    it('conserva imageUrl cuando ya es una URL absoluta http(s) (p. ej. almacenamiento cloud/Cloudinary)', () => {
        const dto = CloudTransferApiMapper.toTransferItemHttpDto(buildItem('https://res.cloudinary.com/demo/foto.webp'));
        expect(dto.product.imageUrl).toBe('https://res.cloudinary.com/demo/foto.webp');
    });

    it('omite imageUrl cuando el producto no tiene imagen (null)', () => {
        const dto = CloudTransferApiMapper.toTransferItemHttpDto(buildItem(null));
        expect(dto.product.imageUrl).toBeUndefined();
    });
});
