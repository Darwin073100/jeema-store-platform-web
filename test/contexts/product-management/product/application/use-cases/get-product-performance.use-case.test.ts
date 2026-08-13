import { GetProductPerformanceUseCase } from '@/contexts/product-management/product/application/use-cases/get-product-performance.use-case';
import { ProductRepository } from '@/contexts/product-management/product/domain/repositories/product.repository';
import { SaleDetailRepository } from '@/contexts/sale-management/sale-detail/domain/repositories/sale-detail.repository';
import { LotRepository } from '@/contexts/purchase-management/lot/domain/repositories/lot.repository';
import { ProductEntity } from '@/contexts/product-management/product/domain/entities/product.entity';
import { ProductNameVO } from '@/contexts/product-management/product/domain/value-objects/product-name.vo';
import { ProductSkuVO } from '@/contexts/product-management/product/domain/value-objects/product-sku.vo';
import { ProductUniversalBarCodeVO } from '@/contexts/product-management/product/domain/value-objects/product-universal-bar-code.vo';
import { ProductDescriptionVO } from '@/contexts/product-management/product/domain/value-objects/product-description.vo';
import { ForSaleEnum } from '@/shared/domain/enums/for-sale.enum';
import { InventoryEntity } from '@/contexts/inventory-management/inventory/domain/entities/inventory.entity';
import { InventoryItemEntity } from '@/contexts/inventory-management/inventory-item/domain/entities/inventory-item.entity';
import { InventoryItemQuantityOnHandVO } from '@/contexts/inventory-management/inventory-item/domain/value-objects/inventory-item-quantity-on-hand.vo';
import { InventorySalePriceOneVO } from '@/contexts/inventory-management/inventory/domain/value-objects/inventory-sale-price-one.vo';
import { LocationEnum } from '@/contexts/inventory-management/inventory-item/domain/enums/location.enum';
import { LotEntity } from '@/contexts/purchase-management/lot/domain/entities/lot.entity';
import { SaleDetailEntity } from '@/contexts/sale-management/sale-detail/domain/entities/sale-detail.entity';
import { SaleEntity } from '@/contexts/sale-management/sale/domain/entities/sale.entity';
import { SaleStatusEnum } from '@/contexts/sale-management/sale/domain/enums/sale-status.enum';
import { SaleForEnum } from '@/contexts/sale-management/sale-detail/domain/enums/sale-for.enum';
import { ReturnsEntity } from '@/contexts/sale-management/returns/domain/entities/returns.entity';

const PRODUCT_ID = BigInt(876);

function buildProduct(inventoryItemsQty: number[], salePriceOne: number | null) {
    const inventory = InventoryEntity.reconstitute(
        BigInt(1),
        PRODUCT_ID,
        BigInt(1),
        true,
        new Date(),
        undefined,
        InventorySalePriceOneVO.create(salePriceOne),
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        null,
        null,
        inventoryItemsQty.map((qty, index) => InventoryItemEntity.reconstitute(
            BigInt(index + 1),
            BigInt(1),
            LocationEnum.SALE,
            InventoryItemQuantityOnHandVO.create(qty),
            new Date(),
        )),
    );

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
        inventory,
        null,
    );
}

function buildSale(createdAt: Date) {
    return SaleEntity.reconstitute(
        BigInt(1),
        BigInt(1),
        BigInt(1),
        BigInt(1),
        BigInt(1),
        0, 0, 0, 0, 0, 0,
        SaleStatusEnum.COMPLETED,
        null,
        createdAt,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
    );
}

function buildSaleDetail(params: {
    quantity: number;
    subtotalItem: number;
    saleCreatedAt: Date;
    returns?: { quantityReturn: number; amountReturn: number }[];
}) {
    const returns = params.returns?.map((item, index) => ReturnsEntity.reconstitute(
        BigInt(index + 1),
        BigInt(1),
        BigInt(1),
        BigInt(1),
        item.quantityReturn,
        item.amountReturn,
        null,
        null,
        null,
        null,
        new Date(),
        null,
        null,
    )) ?? null;

    return SaleDetailEntity.reconstitute(
        BigInt(1),
        BigInt(1),
        PRODUCT_ID,
        BigInt(1),
        'Producto de prueba',
        '000000',
        ForSaleEnum.PC,
        params.quantity,
        100,
        100,
        params.subtotalItem,
        0,
        SaleForEnum.ONE,
        null,
        null,
        null,
        null,
        new Date(),
        null,
        null,
        buildSale(params.saleCreatedAt),
        null,
        null,
        returns,
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

describe('GetProductPerformanceUseCase', () => {
    let productRepository: jest.Mocked<ProductRepository>;
    let saleDetailRepository: jest.Mocked<SaleDetailRepository>;
    let lotRepository: jest.Mocked<LotRepository>;
    let useCase: GetProductPerformanceUseCase;

    beforeEach(() => {
        productRepository = { findById: jest.fn() } as unknown as jest.Mocked<ProductRepository>;
        saleDetailRepository = { findAllByProductId: jest.fn() } as unknown as jest.Mocked<SaleDetailRepository>;
        lotRepository = { findAllByProductId: jest.fn() } as unknown as jest.Mocked<LotRepository>;
        useCase = new GetProductPerformanceUseCase(productRepository, saleDetailRepository, lotRepository);
    });

    test('calcula ventas netas, costo promedio ponderado, ganancia y valorización de stock', async () => {
        productRepository.findById.mockResolvedValue(buildProduct([5, 3], 150));
        saleDetailRepository.findAllByProductId.mockResolvedValue([
            buildSaleDetail({ quantity: 10, subtotalItem: 1000, saleCreatedAt: new Date('2026-01-10') }),
            buildSaleDetail({
                quantity: 5,
                subtotalItem: 500,
                saleCreatedAt: new Date('2026-02-15'),
                returns: [{ quantityReturn: 1, amountReturn: 100 }],
            }),
        ]);
        lotRepository.findAllByProductId.mockResolvedValue([
            buildLot({ purchasePrice: 50, initialQuantity: 10, receivedDate: new Date('2026-01-01') }),
            buildLot({ purchasePrice: 60, initialQuantity: 10, receivedDate: new Date('2026-02-01') }),
        ]);

        const result = await useCase.execute(PRODUCT_ID);

        expect(result.sales.unitsSold).toBe(15);
        expect(result.sales.unitsReturned).toBe(1);
        expect(result.sales.netUnitsSold).toBe(14);
        expect(result.sales.grossRevenue).toBe(1500);
        expect(result.sales.returnsAmount).toBe(100);
        expect(result.sales.netRevenue).toBe(1400);
        expect(result.sales.lastSaleDate).toEqual(new Date('2026-02-15'));

        expect(result.purchases.unitsPurchased).toBe(20);
        expect(result.purchases.totalCost).toBe(1100); // 50*10 + 60*10
        expect(result.purchases.avgUnitCost).toBe(55); // 1100 / 20
        expect(result.purchases.lastPurchaseDate).toEqual(new Date('2026-02-01'));

        expect(result.profit.estimatedCOGS).toBe(770); // 55 * 14
        expect(result.profit.grossProfit).toBe(630); // 1400 - 770
        expect(result.profit.marginPercent).toBeCloseTo(45, 5); // 630 / 1400 * 100

        expect(result.inventory.currentStockTotal).toBe(8); // 5 + 3
        expect(result.inventory.currentStockSaleValue).toBe(1200); // 8 * 150
        expect(result.inventory.currentStockCostValue).toBe(440); // 8 * 55
    });

    test('no divide por cero cuando no hay compras ni ventas registradas', async () => {
        productRepository.findById.mockResolvedValue(buildProduct([], null));
        saleDetailRepository.findAllByProductId.mockResolvedValue([]);
        lotRepository.findAllByProductId.mockResolvedValue([]);

        const result = await useCase.execute(PRODUCT_ID);

        expect(result.purchases.avgUnitCost).toBe(0);
        expect(result.profit.marginPercent).toBe(0);
        expect(result.profit.grossProfit).toBe(0);
        expect(result.inventory.currentStockTotal).toBe(0);
        expect(result.inventory.currentStockSaleValue).toBe(0);
        expect(result.sales.lastSaleDate).toBeNull();
        expect(result.purchases.lastPurchaseDate).toBeNull();
    });
});
