import { randomUUID } from "crypto";
import { DataSource } from "typeorm";
import { createPgMemCloudTransferDataSource } from "../../test-utils/create-pgmem-cloud-transfer-datasource";

// Polyfill local a este archivo (no toca jest.setup.ts ni código de producción): el entorno de test usa
// jsdom (jest.config.ts), cuyo `crypto` global no implementa `randomUUID` en la versión instalada aquí.
// `CategoryEntity.create()` (código de producción sin relación con esta feature, en
// product-management/category) lo usa para `CategoryCreatedEvent` — este es el primer test en el repo que
// ejercita esa ruta, por eso el gap no se había notado antes.
if (!globalThis.crypto) {
    (globalThis as unknown as { crypto: Crypto }).crypto = {} as Crypto;
}
if (typeof globalThis.crypto.randomUUID !== 'function') {
    (globalThis.crypto as unknown as { randomUUID: typeof randomUUID }).randomUUID = randomUUID;
}

// Construir el DataSource de pg-mem registra ~30 entidades (todo el grafo de relaciones alcanzable desde
// cloud-transfer, ver el comentario en create-pgmem-cloud-transfer-datasource.ts) — más lento que el timeout
// por defecto de Jest (5s) para un `beforeEach`, especialmente creando DOS datasources (uno por
// "instalación", ver más abajo) y corriendo junto a otros archivos de test.
jest.setTimeout(30000);
import { FakeCloudTransferApiRepository } from "../../test-utils/fake-cloud-transfer-api.repository";

import { EstablishmentOrmEntity } from "@/contexts/establishment-management/establishment/infraestruture/persistence/typeorm/entities/establishment-orm-entity";
import { AddressOrmEntity } from "@/contexts/establishment-management/address/infraestructure/entities/address.orm-entity";
import { BranchOfficeOrmEntity } from "@/contexts/establishment-management/branch-office/infraestructure/persistence/typeorm/entities/branch-office.orm-entity";
import { EmployeeRoleOrmEntity } from "@/contexts/employee-management/employee-role/infraestruture/persistence/typeorm/entities/employee-role-orm-entity";
import { EmployeeOrmEntity } from "@/contexts/employee-management/employee/infraestruture/persistence/typeorm/entities/employee-orm-entity";
import { CategoryOrmEntity } from "@/contexts/product-management/category/infraestructure/persistence/typeorm/entities/category.orm-entity";
import { BrandOrmEntity } from "@/contexts/product-management/brand/infraestruture/persistence/typeorm/entities/brand-orm-entity";
import { ProductOrmEntity } from "@/contexts/product-management/product/infraestructure/persistence/typeorm/entities/product.orm-entity";
import { LotOrmEntity } from "@/contexts/purchase-management/lot/infraestructura/persistence/typeorm/entities/lot.orm-entity";
import { InventoryOrmEntity } from "@/contexts/inventory-management/inventory/infraestructure/persistence/typeorm/entities/inventory.orm-entity";
import { InventoryItemOrmEntity } from "@/contexts/inventory-management/inventory-item/infraestructure/persistence/typeorm/entities/inventory-item.orm-entity";

import { TypeormTransactionDBRepository } from "@/configuration/databases/typeorm/transaction-db/infraestructure/repositories/TypeormTransactionDBRepository";
import { TypeOrmBranchOfficeRepository } from "@/contexts/establishment-management/branch-office/infraestructure/persistence/typeorm/repositories/typeorm-branch-office.repository";
import { TypeOrmEmployeeRepository } from "@/contexts/employee-management/employee/infraestruture/persistence/typeorm/repositories/typeorm-employee.repository";
import { TypeOrmProductRepository } from "@/contexts/product-management/product/infraestructure/persistence/typeorm/repositories/typeorm-product.repository";
import { TypeormCategoryRepository } from "@/contexts/product-management/category/infraestructure/persistence/typeorm/repositories/typeorm-category.repository";
import { TypeOrmBrandRepository } from "@/contexts/product-management/brand/infraestruture/persistence/typeorm/repositories/typeorm-brand.repository";
import { TypeOrmLotRepository } from "@/contexts/purchase-management/lot/infraestructura/persistence/typeorm/repositories/typeorm-lot.repository";
import { TypeormInventoryRepository } from "@/contexts/inventory-management/inventory/infraestructure/persistence/typeorm/repositories/typeorm-inventory.repository";
import { TypeormInventoryItemRepository } from "@/contexts/inventory-management/inventory-item/infraestructure/persistence/typeorm/repositories/typeorm-inventory-item.repository";
import { TypeormCloudTransferRepository } from "@/contexts/inventory-management/cloud-transfer/infraestructure/repositories/typeorm-cloud-transfer.repository";
import { TypeormCloudTransferItemRepository } from "@/contexts/inventory-management/cloud-transfer/infraestructure/repositories/typeorm-cloud-transfer-item.repository";

import { CreateAndSendCloudTransferUseCase } from "@/contexts/inventory-management/cloud-transfer/application/use-cases/create-and-send-cloud-transfer.use-case";
import { RetrySendCloudTransferUseCase } from "@/contexts/inventory-management/cloud-transfer/application/use-cases/retry-send-cloud-transfer.use-case";
import { RefreshPendingCloudTransfersUseCase } from "@/contexts/inventory-management/cloud-transfer/application/use-cases/refresh-pending-cloud-transfers.use-case";
import { StartProcessingCloudTransferUseCase } from "@/contexts/inventory-management/cloud-transfer/application/use-cases/start-processing-cloud-transfer.use-case";
import { ReceiveCloudTransferUseCase } from "@/contexts/inventory-management/cloud-transfer/application/use-cases/receive-cloud-transfer.use-case";
import { ApproveCloudTransferUseCase } from "@/contexts/inventory-management/cloud-transfer/application/use-cases/approve-cloud-transfer.use-case";
import { ResolveCloudTransferItemAsNewProductUseCase } from "@/contexts/inventory-management/cloud-transfer/application/use-cases/resolve-cloud-transfer-item-as-new-product.use-case";
import { MapCloudCategoryToLocalCategoryUseCase } from "@/contexts/inventory-management/cloud-transfer/application/use-cases/map-cloud-category-to-local-category.use-case";

import { CloudTransferItemResolutionStatusEnum } from "@/contexts/inventory-management/cloud-transfer/domain/enums/cloud-transfer-item-resolution-status.enum";
import { CloudTransferStatusEnum } from "@/contexts/inventory-management/cloud-transfer/domain/enums/cloud-transfer-status.enum";
import { CloudTransferDirectionEnum } from "@/contexts/inventory-management/cloud-transfer/domain/enums/cloud-transfer-direction.enum";
import { CloudTransferItemNotResolvedException } from "@/contexts/inventory-management/cloud-transfer/domain/exceptions/cloud-transfer-item-not-resolved.exception";
import { CloudTransferEntity } from "@/contexts/inventory-management/cloud-transfer/domain/entities/cloud-transfer.entity";
import { CloudTransferItemEntity } from "@/contexts/inventory-management/cloud-transfer/domain/entities/cloud-transfer-item.entity";
import { LocationEnum } from "@/contexts/inventory-management/inventory-item/domain/enums/location.enum";
import { ForSaleEnum } from "@/shared/domain/enums/for-sale.enum";

/**
 * Un "installation" (A o B) = un DataSource de pg-mem completamente independiente + su propio juego de
 * repositorios TypeORM, construidos directamente (`new Typeorm...Repository(dataSource, ...)`, NUNCA
 * `.create()`, que apuntaría a la base de datos real vía `getDataSource()`). Modela con fidelidad el hecho
 * de que A y B son, en producción, dos bases de datos completamente separadas — solo conectadas por la
 * nube (aquí, `FakeCloudTransferApiRepository`, compartido entre ambas). Usar un único DataSource
 * compartido para "A y B" (como hacía una versión anterior de este archivo) produce falsos positivos/
 * negativos: p. ej. `findByRemoteCloudTransferId` del lado B encontraría por accidente la propia fila
 * OUTGOING que A insertó, algo imposible en producción.
 */
interface Installation {
    dataSource: DataSource;
    transactionDB: TypeormTransactionDBRepository;
    branchOfficeRepository: TypeOrmBranchOfficeRepository;
    employeeRepository: TypeOrmEmployeeRepository;
    productRepository: TypeOrmProductRepository;
    categoryRepository: TypeormCategoryRepository;
    brandRepository: TypeOrmBrandRepository;
    lotRepository: TypeOrmLotRepository;
    inventoryRepository: TypeormInventoryRepository;
    inventoryItemRepository: TypeormInventoryItemRepository;
    cloudTransferRepository: TypeormCloudTransferRepository;
    cloudTransferItemRepository: TypeormCloudTransferItemRepository;
    establishmentId: bigint;
    branchOfficeId: bigint;
    cloudBranchOfficeId: bigint;
    employeeId: bigint;
    categoryId: bigint;
    brandId: bigint;
}

async function createInstallation(params: {
    branchName: string; cloudBranchOfficeId: bigint; city: string;
}): Promise<Installation> {
    const dataSource = await createPgMemCloudTransferDataSource();
    const transactionDB = new TypeormTransactionDBRepository(dataSource);

    const establishment = await dataSource.getRepository(EstablishmentOrmEntity).save({
        name: `Establecimiento ${params.branchName} ${Date.now()}-${Math.random()}`,
    });
    const address = await dataSource.getRepository(AddressOrmEntity).save({
        municipality: 'Centro', city: params.city, state: params.city, postalCode: '00000', country: 'MX',
    });
    const branchOffice = await dataSource.getRepository(BranchOfficeOrmEntity).save({
        establishmentId: establishment.establishmentId, addressId: address.addressId,
        name: params.branchName, cloudBranchOfficeId: params.cloudBranchOfficeId,
    });
    const employeeRole = await dataSource.getRepository(EmployeeRoleOrmEntity).save({ name: 'Encargado' });
    const employee = await dataSource.getRepository(EmployeeOrmEntity).save({
        branchOfficeId: branchOffice.branchOfficeId, employeeRoleId: employeeRole.employeeRoleId,
        firstName: 'Empleado', lastName: params.branchName, isActive: true,
    });
    const category = await dataSource.getRepository(CategoryOrmEntity).save({
        establishmentId: establishment.establishmentId, name: 'Abarrotes', description: null,
    });
    const brand = await dataSource.getRepository(BrandOrmEntity).save({
        establishmentId: establishment.establishmentId, name: `Marca ${params.branchName}`,
    });

    return {
        dataSource, transactionDB,
        branchOfficeRepository: new TypeOrmBranchOfficeRepository(dataSource, transactionDB),
        employeeRepository: new TypeOrmEmployeeRepository(dataSource, transactionDB),
        productRepository: new TypeOrmProductRepository(dataSource),
        categoryRepository: new TypeormCategoryRepository(dataSource),
        brandRepository: new TypeOrmBrandRepository(dataSource),
        lotRepository: new TypeOrmLotRepository(dataSource, transactionDB),
        inventoryRepository: new TypeormInventoryRepository(dataSource),
        inventoryItemRepository: new TypeormInventoryItemRepository(dataSource, transactionDB),
        cloudTransferRepository: new TypeormCloudTransferRepository(dataSource, transactionDB),
        cloudTransferItemRepository: new TypeormCloudTransferItemRepository(dataSource, transactionDB),
        establishmentId: establishment.establishmentId,
        branchOfficeId: branchOffice.branchOfficeId,
        cloudBranchOfficeId: params.cloudBranchOfficeId,
        employeeId: employee.employeeId,
        categoryId: category.categoryId,
        brandId: brand.brandId,
    };
}

/** Crea Product + Inventory + InventoryItem(STOCK) SIN lote — cubre el traspaso de productos que nunca
 * tuvieron un lote de compra registrado (ver CreateAndSendCloudTransferUseCase, que sintetiza el snapshot
 * de lote a partir del producto cuando `originLocalLotId` llega null). */
async function seedProductWithStockNoLot(side: Installation, params: { name: string; barcode: string | null; stock: number; averageCost?: number }) {
    const product = await side.dataSource.getRepository(ProductOrmEntity).save({
        establishmentId: side.establishmentId, categoryId: side.categoryId, brandId: side.brandId,
        name: params.name, sku: null, universalBarCode: params.barcode, description: null,
        unitOfMeasure: ForSaleEnum.PC, minStockGlobal: null, imageUrl: null,
        averageCost: (params.averageCost ?? 12.5).toString(),
    });
    const inventory = await side.dataSource.getRepository(InventoryOrmEntity).save({
        productId: product.productId, branchOfficeId: side.branchOfficeId, isSellable: true,
        salePriceOne: 15, salePriceMany: null, saleQuantityMany: null, salePriceSpecial: null,
        minStockBranch: null, maxStockBranch: null,
    });
    const inventoryItem = await side.dataSource.getRepository(InventoryItemOrmEntity).save({
        inventoryId: inventory.inventoryId, location: LocationEnum.STOCK, quantityOnHand: params.stock,
    });
    return { productId: product.productId, inventoryId: inventory.inventoryId, inventoryItemId: inventoryItem.inventoryItemId };
}

/** Crea Product + Lot + Inventory + InventoryItem(STOCK) en la instalación dada, con stock inicial. */
async function seedProductWithStock(side: Installation, params: { name: string; barcode: string | null; stock: number }) {
    const product = await side.dataSource.getRepository(ProductOrmEntity).save({
        establishmentId: side.establishmentId, categoryId: side.categoryId, brandId: side.brandId,
        name: params.name, sku: null, universalBarCode: params.barcode, description: null,
        unitOfMeasure: ForSaleEnum.PC, minStockGlobal: null, imageUrl: null,
    });
    const lot = await side.dataSource.getRepository(LotOrmEntity).save({
        // Lote inicial "de origen"/"ya en catálogo" del seed. Debe ser único incluso entre instalaciones
        // (bases de datos) distintas: `ApproveCloudTransferUseCase` crea un lote NUEVO en B reusando el
        // `lotNumber` que viajó en el snapshot desde A, y como cada instalación es una DB de pg-mem fresca,
        // sus secuencias de `product_id` reinician en 1 — un esquema `L-${productId}` colisionaría con el
        // lote sembrado aquí en B para el mismo `matchedLocalProductId`.
        productId: product.productId, suplierId: null, lotNumber: `L-SEED-${params.name.replace(/[^a-zA-Z0-9]/g, '')}-${product.productId}`,
        purchasePrice: '10.00', purchaseUnit: ForSaleEnum.PC, initialQuantity: params.stock.toString(),
        expirationDate: null, manufacturingDate: null, receivedDate: new Date('2026-01-01'),
    });
    const inventory = await side.dataSource.getRepository(InventoryOrmEntity).save({
        productId: product.productId, branchOfficeId: side.branchOfficeId, isSellable: true,
        salePriceOne: 15, salePriceMany: null, saleQuantityMany: null, salePriceSpecial: null,
        minStockBranch: null, maxStockBranch: null,
    });
    const inventoryItem = await side.dataSource.getRepository(InventoryItemOrmEntity).save({
        inventoryId: inventory.inventoryId, location: LocationEnum.STOCK, quantityOnHand: params.stock,
    });
    return { productId: product.productId, lotId: lot.lotId, inventoryId: inventory.inventoryId, inventoryItemId: inventoryItem.inventoryItemId };
}

// Cada test crea SOLO las "instalaciones" (DataSource pg-mem independiente) que realmente necesita — crear
// las dos (A y B) en un `beforeEach` compartido para los 4 tests, aunque varios solo usan un lado, resultó
// mucho más lento acumulado (~2 DataSources de pg-mem de más por test, sobre un proceso Jest de un solo
// worker) que crear bajo demanda dentro de cada `it()` y liberar con `finally`.
describe('cloud-transfer integration (pg-mem)', () => {
    let fakeApi: FakeCloudTransferApiRepository;

    beforeEach(() => {
        fakeApi = new FakeCloudTransferApiRepository();
    });

    async function destroy(...installations: Installation[]) {
        for (const installation of installations) {
            if (installation?.dataSource?.isInitialized) await installation.dataSource.destroy();
        }
    }

    function buildCreateUseCase(side: Installation) {
        return new CreateAndSendCloudTransferUseCase(
            side.cloudTransferRepository, side.cloudTransferItemRepository, fakeApi, side.branchOfficeRepository,
            side.employeeRepository, side.productRepository, side.categoryRepository, side.brandRepository,
            side.lotRepository, side.inventoryRepository, side.inventoryItemRepository, side.transactionDB,
        );
    }

    it('crea el traspaso local + descuenta stock aunque el envío a la nube falle, y el reintento es idempotente', async () => {
        const a = await createInstallation({ branchName: 'Sucursal A', cloudBranchOfficeId: BigInt(1001), city: 'CDMX' });
        try {
            const origin = await seedProductWithStock(a, { name: 'Producto Origen', barcode: 'BC-1', stock: 50 });

            fakeApi.setFailNextCreate(true);

            const useCase = buildCreateUseCase(a);
            const first = await useCase.execute({
                fromBranchOfficeId: a.branchOfficeId,
                toCloudBranchOfficeId: BigInt(1002), // sucursal B, solo su cloudBranchOfficeId es relevante aquí
                shipmentNotes: 'Primer intento',
                requestedByEmployeeId: a.employeeId,
                items: [{
                    originLocalProductId: origin.productId, originLocalLotId: origin.lotId,
                    originLocalInventoryItemId: origin.inventoryItemId, quantityToTransfer: 10,
                }],
            });

            expect(first.sendResult.ok).toBe(false);
            expect(first.transfer.remoteCloudTransferId).toBeNull();

            const itemAfterFirstAttempt = await a.inventoryItemRepository.findById(origin.inventoryItemId);
            expect(itemAfterFirstAttempt?.quantityOnHand.value).toBe(40); // 50 - 10, descontado aunque falló el envío

            const retryUseCase = new RetrySendCloudTransferUseCase(a.cloudTransferRepository, fakeApi);
            const retried = await retryUseCase.execute(first.transfer.cloudTransferId);

            expect(retried.sendResult.ok).toBe(true);
            expect(retried.transfer.remoteCloudTransferId).not.toBeNull();
            expect(fakeApi.createCallCount).toBe(2);

            const itemAfterRetry = await a.inventoryItemRepository.findById(origin.inventoryItemId);
            expect(itemAfterRetry?.quantityOnHand.value).toBe(40); // no se descuenta dos veces

            const persisted = await a.cloudTransferRepository.findById(first.transfer.cloudTransferId);
            expect(persisted?.status).toBe(CloudTransferStatusEnum.PENDING);
            expect(persisted?.remoteCloudTransferId).toBe(retried.transfer.remoteCloudTransferId);
        } finally {
            await destroy(a);
        }
    });

    it('crea el traspaso con un producto sin lote registrado, sintetizando el snapshot de lote desde el producto', async () => {
        const a = await createInstallation({ branchName: 'Sucursal A', cloudBranchOfficeId: BigInt(1001), city: 'CDMX' });
        try {
            const origin = await seedProductWithStockNoLot(a, { name: 'Producto Sin Lote', barcode: 'BC-NO-LOT', stock: 20, averageCost: 7.5 });

            const useCase = buildCreateUseCase(a);
            const result = await useCase.execute({
                fromBranchOfficeId: a.branchOfficeId,
                toCloudBranchOfficeId: BigInt(1002),
                shipmentNotes: 'Traspaso sin lote',
                requestedByEmployeeId: a.employeeId,
                items: [{
                    originLocalProductId: origin.productId, originLocalLotId: null,
                    originLocalInventoryItemId: origin.inventoryItemId, quantityToTransfer: 6,
                }],
            });

            expect(result.sendResult.ok).toBe(true);
            expect(result.transfer.items).toHaveLength(1);
            const item = result.transfer.items[0];
            expect(item.originLocalLotId).toBeNull();
            expect(item.lotNumber).toBe('SIN-LOTE');
            expect(item.lotPurchasePrice).toBe(7.5); // = product.averageCost, no hay lote real del que leerlo
            expect(item.lotTransferredQuantity).toBe(6);

            const itemAfter = await a.inventoryItemRepository.findById(origin.inventoryItemId);
            expect(itemAfter?.quantityOnHand.value).toBe(14); // 20 - 6, el descuento no depende de tener lote
        } finally {
            await destroy(a);
        }
    });

    it('cuando A y B comparten la misma base de datos, B ve el traspaso como entrante tras Actualizar (no lo confunde con la fila OUTGOING de A)', async () => {
        // A diferencia del resto de tests de este archivo (que usan DOS DataSources pg-mem separados para
        // modelar A y B como instalaciones realmente distintas), este test crea DOS sucursales dentro de UN
        // solo `Installation` — el deployment single-tenant multi-sucursal real de este repo (un único
        // `DATABASE_URL`/DataSource sirviendo a todas las sucursales de un establecimiento, ver config.ts).
        // Reproduce el bug real: `RefreshPendingCloudTransfersUseCase.upsertMirror` (lado B) hacía
        // `findByRemoteCloudTransferId` sin escopar por `direction`, así que encontraba la fila OUTGOING que
        // A ya había insertado para el mismo `remoteCloudTransferId` y nunca creaba la fila INCOMING de B —
        // "Entrantes" quedaba vacío en la UI de B aunque EDYOF sí tuviera el traspaso.
        const shared = await createInstallation({ branchName: 'Sucursal A (Matriz)', cloudBranchOfficeId: BigInt(2001), city: 'CDMX' });
        try {
            const addressB = await shared.dataSource.getRepository(AddressOrmEntity).save({
                municipality: 'Centro', city: 'GDL', state: 'GDL', postalCode: '00000', country: 'MX',
            });
            const branchOfficeB = await shared.dataSource.getRepository(BranchOfficeOrmEntity).save({
                establishmentId: shared.establishmentId, addressId: addressB.addressId,
                name: 'Sucursal B', cloudBranchOfficeId: BigInt(2002),
            });

            const origin = await seedProductWithStock(shared, { name: 'Producto Compartido', barcode: 'BC-SHARED', stock: 30 });

            const createUseCase = buildCreateUseCase(shared);
            const created = await createUseCase.execute({
                fromBranchOfficeId: shared.branchOfficeId,
                toCloudBranchOfficeId: branchOfficeB.cloudBranchOfficeId!,
                shipmentNotes: null,
                requestedByEmployeeId: shared.employeeId,
                items: [{
                    originLocalProductId: origin.productId, originLocalLotId: origin.lotId,
                    originLocalInventoryItemId: origin.inventoryItemId, quantityToTransfer: 4,
                }],
            });
            expect(created.sendResult.ok).toBe(true);

            const refreshUseCase = new RefreshPendingCloudTransfersUseCase(shared.cloudTransferRepository, fakeApi, shared.branchOfficeRepository);
            const refreshResult = await refreshUseCase.execute(branchOfficeB.branchOfficeId);

            expect(refreshResult.ok).toBe(true);
            expect(refreshResult.value).toHaveLength(1); // antes del fix: 0 (encontraba y "reciclaba" la fila OUTGOING de A)
            expect(refreshResult.value![0].direction).toBe(CloudTransferDirectionEnum.INCOMING);
            expect(refreshResult.value![0].toBranchOfficeId?.toString()).toBe(branchOfficeB.branchOfficeId.toString());
            expect(refreshResult.value![0].remoteCloudTransferId?.toString()).toBe(created.transfer.remoteCloudTransferId?.toString());

            // La fila OUTGOING original de A sigue intacta y sin mezclarse con la de B.
            const outgoingList = await shared.cloudTransferRepository.findAllByBranchOffice(shared.branchOfficeId, CloudTransferDirectionEnum.OUTGOING);
            expect(outgoingList).toHaveLength(1);
            expect(outgoingList[0].direction).toBe(CloudTransferDirectionEnum.OUTGOING);
        } finally {
            await destroy(shared);
        }
    });

    it('auto-match por barcode: encuentra el producto existente y deja PENDING el que no tiene match', async () => {
        const b = await createInstallation({ branchName: 'Sucursal B', cloudBranchOfficeId: BigInt(1002), city: 'GDL' });
        try {
            const existingAtB = await seedProductWithStock(b, { name: 'Producto Existente en B', barcode: 'BC-MATCH', stock: 5 });

            const matchedItem = CloudTransferItemEntity.create({
                cloudTransferId: BigInt(0), lineNumber: 1, productUniversalBarCode: 'BC-MATCH', productName: 'Producto Existente en B',
                productSku: null, productCategoryName: 'Abarrotes', productUnitOfMeasure: ForSaleEnum.PC,
                lotNumber: 'L-REMOTE-1', lotPurchasePrice: 10, lotPurchaseUnit: ForSaleEnum.PC, lotTransferredQuantity: 3,
            });
            const unmatchedItem = CloudTransferItemEntity.create({
                cloudTransferId: BigInt(0), lineNumber: 2, productUniversalBarCode: 'BC-NO-MATCH', productName: 'Producto Nuevo',
                productSku: null, productCategoryName: 'Otra Categoria', productUnitOfMeasure: ForSaleEnum.PC,
                lotNumber: 'L-REMOTE-2', lotPurchasePrice: 8, lotPurchaseUnit: ForSaleEnum.PC, lotTransferredQuantity: 2,
            });

            // Registra el remoto en el fake primero, para usar el id que el fake realmente asigna (igual
            // que el shape real de EDYOF: el id remoto no lo elige el cliente).
            const registered = await fakeApi.create({
                fromCloudBranchId: '1001', toCloudBranchId: '1002', localTransferId: 'seed-auto-match', items: [],
            });
            const remoteCloudTransferId = BigInt(registered.value!.cloudTransferId);

            const mirror = CloudTransferEntity.fromCloudSnapshot(
                remoteCloudTransferId, BigInt(1001), BigInt(1002), b.branchOfficeId, CloudTransferStatusEnum.PENDING, null,
                [matchedItem, unmatchedItem],
            );
            const savedMirror = await b.cloudTransferRepository.save(mirror);

            const useCase = new StartProcessingCloudTransferUseCase(
                b.cloudTransferRepository, b.cloudTransferItemRepository, fakeApi, b.productRepository,
                b.inventoryRepository, b.branchOfficeRepository, b.employeeRepository,
            );

            const result = await useCase.execute(savedMirror.cloudTransferId, b.employeeId);
            expect(result.ok).toBe(true);

            const matched = result.value!.items.find(i => i.productUniversalBarCode === 'BC-MATCH')!;
            const unmatched = result.value!.items.find(i => i.productUniversalBarCode === 'BC-NO-MATCH')!;

            expect(matched.resolutionStatus).toBe(CloudTransferItemResolutionStatusEnum.MATCHED);
            expect(matched.autoMatchedByBarcode).toBe(true);
            expect(BigInt(matched.matchedLocalProductId!)).toBe(BigInt(existingAtB.productId));

            expect(unmatched.resolutionStatus).toBe(CloudTransferItemResolutionStatusEnum.PENDING);
            expect(unmatched.matchedLocalProductId).toBeNull();
        } finally {
            await destroy(b);
        }
    });

    it('ciclo completo pending -> processing -> received -> approved con una línea MATCHED y una NEW_PRODUCT', async () => {
        const a = await createInstallation({ branchName: 'Sucursal A', cloudBranchOfficeId: BigInt(1001), city: 'CDMX' });
        const b = await createInstallation({ branchName: 'Sucursal B', cloudBranchOfficeId: BigInt(1002), city: 'GDL' });
        try {
            const existingAtB = await seedProductWithStock(b, { name: 'Producto ya en catálogo B', barcode: 'BC-CYCLE-MATCH', stock: 0 });
            const originAtA1 = await seedProductWithStock(a, { name: 'Producto a transferir (match)', barcode: 'BC-CYCLE-MATCH', stock: 20 });
            const originAtA2 = await seedProductWithStock(a, { name: 'Producto a transferir (nuevo)', barcode: 'BC-CYCLE-NEW', stock: 15 });

            const createUseCase = buildCreateUseCase(a);
            const created = await createUseCase.execute({
                fromBranchOfficeId: a.branchOfficeId,
                toCloudBranchOfficeId: b.cloudBranchOfficeId,
                shipmentNotes: 'Ciclo completo',
                requestedByEmployeeId: a.employeeId,
                items: [
                    { originLocalProductId: originAtA1.productId, originLocalLotId: originAtA1.lotId, originLocalInventoryItemId: originAtA1.inventoryItemId, quantityToTransfer: 5 },
                    { originLocalProductId: originAtA2.productId, originLocalLotId: originAtA2.lotId, originLocalInventoryItemId: originAtA2.inventoryItemId, quantityToTransfer: 3 },
                ],
            });
            expect(created.sendResult.ok).toBe(true);

            // B se entera del traspaso vía GET pending (RefreshPendingCloudTransfersUseCase), no comparte
            // base de datos con A — solo la nube (fakeApi) los conecta.
            const refreshUseCase = new RefreshPendingCloudTransfersUseCase(b.cloudTransferRepository, fakeApi, b.branchOfficeRepository);
            const refreshed = await refreshUseCase.execute(b.branchOfficeId);
            expect(refreshed.ok).toBe(true);
            expect(refreshed.value!.length).toBe(1);
            const mirror = refreshed.value![0];

            const startProcessingUseCase = new StartProcessingCloudTransferUseCase(
                b.cloudTransferRepository, b.cloudTransferItemRepository, fakeApi, b.productRepository,
                b.inventoryRepository, b.branchOfficeRepository, b.employeeRepository,
            );
            const started = await startProcessingUseCase.execute(mirror.cloudTransferId, b.employeeId);
            expect(started.ok).toBe(true);
            expect(started.value!.status).toBe(CloudTransferStatusEnum.IN_TRANSIT);

            const matchedItem = started.value!.items.find(i => i.productUniversalBarCode === 'BC-CYCLE-MATCH')!;
            const pendingItem = started.value!.items.find(i => i.productUniversalBarCode === 'BC-CYCLE-NEW')!;
            expect(matchedItem.resolutionStatus).toBe(CloudTransferItemResolutionStatusEnum.MATCHED);
            expect(BigInt(matchedItem.matchedLocalProductId!)).toBe(BigInt(existingAtB.productId));
            expect(pendingItem.resolutionStatus).toBe(CloudTransferItemResolutionStatusEnum.PENDING);

            // Resuelve la línea PENDING como producto nuevo.
            const mapCategoryUseCase = new MapCloudCategoryToLocalCategoryUseCase(b.categoryRepository);
            const localCategory = await mapCategoryUseCase.execute({ establishmentId: b.establishmentId, newCategoryName: pendingItem.productCategoryName });

            const resolveNewUseCase = new ResolveCloudTransferItemAsNewProductUseCase(
                b.cloudTransferItemRepository, b.productRepository, b.categoryRepository, b.brandRepository, b.inventoryRepository,
            );
            const resolvedNew = await resolveNewUseCase.execute({
                cloudTransferItemId: pendingItem.cloudTransferItemId, establishmentId: b.establishmentId, branchOfficeId: b.branchOfficeId,
                localCategoryId: localCategory.categoryId,
            });
            expect(resolvedNew.resolutionStatus).toBe(CloudTransferItemResolutionStatusEnum.NEW_PRODUCT);
            expect(resolvedNew.matchedLocalProductId).not.toBeNull();

            const receiveUseCase = new ReceiveCloudTransferUseCase(b.cloudTransferRepository, fakeApi, b.branchOfficeRepository, b.employeeRepository);
            const received = await receiveUseCase.execute(mirror.cloudTransferId, b.employeeId, 'todo llegó');
            expect(received.ok).toBe(true);
            expect(received.value!.status).toBe(CloudTransferStatusEnum.RECEIVED);

            const approveUseCase = new ApproveCloudTransferUseCase(
                b.cloudTransferRepository, b.cloudTransferItemRepository, fakeApi, b.branchOfficeRepository,
                b.lotRepository, b.inventoryItemRepository, b.transactionDB,
            );
            const approved = await approveUseCase.execute(mirror.cloudTransferId, b.employeeId, 'aprobado');
            expect(approved.ok).toBe(true);
            expect(approved.value!.status).toBe(CloudTransferStatusEnum.APPROVED);

            const approvedMatchedItem = approved.value!.items.find(i => i.productUniversalBarCode === 'BC-CYCLE-MATCH')!;
            const approvedNewItem = approved.value!.items.find(i => i.productUniversalBarCode === 'BC-CYCLE-NEW')!;
            expect(approvedMatchedItem.matchedLocalLotId).not.toBeNull();
            expect(approvedMatchedItem.matchedLocalInventoryItemId).not.toBeNull();
            expect(approvedNewItem.matchedLocalLotId).not.toBeNull();
            expect(approvedNewItem.matchedLocalInventoryItemId).not.toBeNull();

            // El stock de B para el producto MATCHED (existía con 0) ahora debe tener las 5 unidades transferidas.
            const bMatchedInventoryItem = await b.inventoryItemRepository.findById(approvedMatchedItem.matchedLocalInventoryItemId!);
            expect(bMatchedInventoryItem?.quantityOnHand.value).toBe(5);

            // El producto NEW_PRODUCT recién creado en B debe tener las 3 unidades transferidas.
            const bNewInventoryItem = await b.inventoryItemRepository.findById(approvedNewItem.matchedLocalInventoryItemId!);
            expect(bNewInventoryItem?.quantityOnHand.value).toBe(3);
        } finally {
            await destroy(a, b);
        }
    });

    it('ApproveCloudTransferUseCase rechaza si queda algún item PENDING', async () => {
        const b = await createInstallation({ branchName: 'Sucursal B', cloudBranchOfficeId: BigInt(1002), city: 'GDL' });
        try {
            const pendingLineItem = CloudTransferItemEntity.create({
                cloudTransferId: BigInt(0), lineNumber: 1, productUniversalBarCode: 'BC-X', productName: 'Sin resolver',
                productSku: null, productCategoryName: 'Cat', productUnitOfMeasure: ForSaleEnum.PC,
                lotNumber: 'L-X', lotPurchasePrice: 10, lotPurchaseUnit: ForSaleEnum.PC, lotTransferredQuantity: 1,
            });
            const mirror = CloudTransferEntity.fromCloudSnapshot(
                BigInt(9999), BigInt(1001), BigInt(1002), b.branchOfficeId, CloudTransferStatusEnum.PENDING, null, [pendingLineItem],
            );
            const saved = await b.cloudTransferRepository.save(mirror);
            saved.startProcessing(b.employeeId);
            await b.cloudTransferRepository.save(saved);
            const inTransit = await b.cloudTransferRepository.findById(saved.cloudTransferId);
            inTransit!.receive(b.employeeId, null);
            await b.cloudTransferRepository.save(inTransit!);

            const approveUseCase = new ApproveCloudTransferUseCase(
                b.cloudTransferRepository, b.cloudTransferItemRepository, fakeApi, b.branchOfficeRepository,
                b.lotRepository, b.inventoryItemRepository, b.transactionDB,
            );

            await expect(approveUseCase.execute(saved.cloudTransferId, b.employeeId, null))
                .rejects.toThrow(CloudTransferItemNotResolvedException);
        } finally {
            await destroy(b);
        }
    });
});
