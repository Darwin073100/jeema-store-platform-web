import { RecalculateProductAverageCostUseCase } from '@/contexts/product-management/product/application/use-cases/recalculate-product-average-cost.use-case';
import { ProductRepository } from '@/contexts/product-management/product/domain/repositories/product.repository';
import { LotRepository } from '@/contexts/purchase-management/lot/domain/repositories/lot.repository';
import { SaleDetailRepository } from '@/contexts/sale-management/sale-detail/domain/repositories/sale-detail.repository';
import { ProductEntity } from '@/contexts/product-management/product/domain/entities/product.entity';
import { ProductNameVO } from '@/contexts/product-management/product/domain/value-objects/product-name.vo';
import { ProductSkuVO } from '@/contexts/product-management/product/domain/value-objects/product-sku.vo';
import { ProductUniversalBarCodeVO } from '@/contexts/product-management/product/domain/value-objects/product-universal-bar-code.vo';
import { ProductDescriptionVO } from '@/contexts/product-management/product/domain/value-objects/product-description.vo';
import { ForSaleEnum } from '@/shared/domain/enums/for-sale.enum';
import { LotEntity } from '@/contexts/purchase-management/lot/domain/entities/lot.entity';
import { SaleDetailEntity } from '@/contexts/sale-management/sale-detail/domain/entities/sale-detail.entity';
import { SaleForEnum } from '@/contexts/sale-management/sale-detail/domain/enums/sale-for.enum';
import { ProductNotFoundException } from '@/contexts/product-management/product/domain/exceptions/product-not-found.exception';

const PRODUCT_ID = BigInt(500);

function buildProduct(averageCost: number = 0) {
    return ProductEntity.reconstitute(
        PRODUCT_ID,
        BigInt(1),
        BigInt(1),
        null,
        null,
        new ProductNameVO('Producto de prueba'),
        new ProductSkuVO('SKU-1'),
        new ProductUniversalBarCodeVO(null),
        new ProductDescriptionVO(null),
        ForSaleEnum.PC,
        0,
        null,
        new Date(),
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        averageCost,
    );
}

function buildLot(params: { purchasePrice: number; initialQuantity: number; receivedDate: Date }) {
    return LotEntity.reconstitute(
        BigInt(1),
        PRODUCT_ID,
        null,
        'LOTE-1',
        params.purchasePrice,
        params.initialQuantity,
        ForSaleEnum.PC,
        params.receivedDate,
        null,
        null,
        new Date(),
        null,
        null,
        null,
        null,
        null,
    );
}

function buildSaleDetail(quantity: number) {
    return SaleDetailEntity.reconstitute(
        BigInt(1),
        BigInt(1),
        PRODUCT_ID,
        BigInt(1),
        'Producto de prueba',
        '000000',
        ForSaleEnum.PC,
        quantity,
        100,
        100,
        quantity * 100,
        0,
        SaleForEnum.ONE,
        null,
        null,
        null,
        null,
        new Date(),
        null,
        null,
        null,
        null,
        null,
        null,
    );
}

describe('RecalculateProductAverageCostUseCase', () => {
    let productRepository: jest.Mocked<ProductRepository>;
    let lotRepository: jest.Mocked<LotRepository>;
    let saleDetailRepository: jest.Mocked<SaleDetailRepository>;
    let useCase: RecalculateProductAverageCostUseCase;

    beforeEach(() => {
        productRepository = {
            findById: jest.fn(),
            updateAverageCost: jest.fn(),
        } as unknown as jest.Mocked<ProductRepository>;
        lotRepository = { findAllByProductId: jest.fn() } as unknown as jest.Mocked<LotRepository>;
        saleDetailRepository = { findAllByProductId: jest.fn() } as unknown as jest.Mocked<SaleDetailRepository>;
        useCase = new RecalculateProductAverageCostUseCase(productRepository, lotRepository, saleDetailRepository);
    });

    test('lanza ProductNotFoundException si el producto no existe', async () => {
        productRepository.findById.mockResolvedValue(null);

        await expect(useCase.execute(PRODUCT_ID)).rejects.toThrow(ProductNotFoundException);
        expect(productRepository.updateAverageCost).not.toHaveBeenCalled();
    });

    test('con lotes parcialmente consumidos, promedia ponderado solo el remanente FIFO (stock actual)', async () => {
        // Lote 1: 10 unidades a $50 (recibido primero) — se consume totalmente por la venta.
        // Lote 2: 10 unidades a $60 (recibido después) — se consume parcialmente, queda remanente.
        // Lote 3: 5 unidades a $80 (recibido al final) — no se toca, remanente completo.
        // Total vendido: 15 unidades → consume las 10 del lote 1 + 5 del lote 2.
        // Remanente: 5 unidades del lote 2 a $60 + 5 unidades del lote 3 a $80.
        // averageCost = (5*60 + 5*80) / 10 = 70
        productRepository.findById.mockResolvedValue(buildProduct(0));
        lotRepository.findAllByProductId.mockResolvedValue([
            buildLot({ purchasePrice: 50, initialQuantity: 10, receivedDate: new Date('2026-01-01') }),
            buildLot({ purchasePrice: 60, initialQuantity: 10, receivedDate: new Date('2026-02-01') }),
            buildLot({ purchasePrice: 80, initialQuantity: 5, receivedDate: new Date('2026-03-01') }),
        ]);
        saleDetailRepository.findAllByProductId.mockResolvedValue([
            buildSaleDetail(15),
        ]);
        productRepository.updateAverageCost.mockImplementation(async (productId, averageCost) =>
            buildProduct(averageCost),
        );

        const result = await useCase.execute(PRODUCT_ID);

        expect(productRepository.updateAverageCost).toHaveBeenCalledWith(PRODUCT_ID, 70);
        expect(result.averageCost).toBe(70);
    });

    test('sin lotes, el promedio queda en 0', async () => {
        productRepository.findById.mockResolvedValue(buildProduct(55));
        lotRepository.findAllByProductId.mockResolvedValue([]);
        saleDetailRepository.findAllByProductId.mockResolvedValue([]);
        productRepository.updateAverageCost.mockImplementation(async (productId, averageCost) =>
            buildProduct(averageCost),
        );

        const result = await useCase.execute(PRODUCT_ID);

        expect(productRepository.updateAverageCost).toHaveBeenCalledWith(PRODUCT_ID, 0);
        expect(result.averageCost).toBe(0);
    });

    test('cuando se vendió todo el stock comprado, no queda remanente y el promedio es 0', async () => {
        productRepository.findById.mockResolvedValue(buildProduct(50));
        lotRepository.findAllByProductId.mockResolvedValue([
            buildLot({ purchasePrice: 50, initialQuantity: 10, receivedDate: new Date('2026-01-01') }),
        ]);
        saleDetailRepository.findAllByProductId.mockResolvedValue([
            buildSaleDetail(10),
        ]);
        productRepository.updateAverageCost.mockImplementation(async (productId, averageCost) =>
            buildProduct(averageCost),
        );

        const result = await useCase.execute(PRODUCT_ID);

        expect(productRepository.updateAverageCost).toHaveBeenCalledWith(PRODUCT_ID, 0);
        expect(result.averageCost).toBe(0);
    });

    test('calculate() no persiste, solo retorna el costo que resultaría', async () => {
        lotRepository.findAllByProductId.mockResolvedValue([
            buildLot({ purchasePrice: 40, initialQuantity: 10, receivedDate: new Date('2026-01-01') }),
        ]);
        saleDetailRepository.findAllByProductId.mockResolvedValue([]);

        const preview = await useCase.calculate(PRODUCT_ID);

        expect(preview).toBe(40);
        expect(productRepository.updateAverageCost).not.toHaveBeenCalled();
    });
});
