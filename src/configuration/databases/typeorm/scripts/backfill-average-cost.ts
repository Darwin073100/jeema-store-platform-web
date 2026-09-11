/**
 * Script de backfill de datos de negocio (no de esquema) para la feature de "costo de venta
 * estable (promedio móvil)". Se corre UNA SOLA VEZ, manualmente, después de correr las
 * migraciones `AddAverageCostToProduct` y `AddUnitCostAtSaleToSaleDetail`.
 *
 * Qué hace:
 *  1. Recorre todos los Product y llama RecalculateProductAverageCostUseCase (el mismo use-case
 *     que usa el botón "Recalcular costo" y el hook de compra) — fija el averageCost correcto
 *     para TODOS los productos, no solo los que están en 0.
 *  2. Recorre las SaleDetail con unit_cost_at_sale IS NULL (ventas históricas, previas a esta
 *     feature) y las rellena con el averageCost recién calculado del producto correspondiente.
 *
 *     APROXIMACIÓN ACEPTADA Y CONFIRMADA CON EL USUARIO: se usa el costo promedio recalculado de
 *     HOY, no el costo histórico real de cada venta — ese dato ya no existe porque antes de esta
 *     feature nunca se guardó un snapshot del costo en el momento de la venta. Es una
 *     aproximación, no un valor exacto retroactivo.
 *  3. Loguea un resumen (productos procesados, con error, y ventas rellenadas) al final.
 *
 * No se integra a `migration:run`: no es un cambio de esquema sino un recálculo de datos de
 * negocio (mismo criterio que el script SQL de seed documentado en CLAUDE.md).
 *
 * Uso:
 *   pnpm run backfill:average-cost              # ejecuta el backfill contra la DB configurada
 *   pnpm run backfill:average-cost -- --dry-run  # solo loguea qué haría, sin escribir en la DB
 */
import 'reflect-metadata';
import { getDataSource } from '../config/config';
import { ProductOrmEntity } from 'src/contexts/product-management/product/infraestructure/persistence/typeorm/entities/product.orm-entity';
import { TypeOrmProductRepository } from 'src/contexts/product-management/product/infraestructure/persistence/typeorm/repositories/typeorm-product.repository';
import { TypeOrmLotRepository } from 'src/contexts/purchase-management/lot/infraestructura/persistence/typeorm/repositories/typeorm-lot.repository';
import { TypeormSaleDetailRepository } from 'src/contexts/sale-management/sale-detail/infraestructure/persistence/typeorm/repositories/typeorm-sale-detail.repository';
import { RecalculateProductAverageCostUseCase } from 'src/contexts/product-management/product/application/use-cases/recalculate-product-average-cost.use-case';

const isDryRun = process.argv.includes('--dry-run');

interface FailedProduct {
    productId: bigint;
    name: string;
    error: string;
}

async function backfillAverageCost(): Promise<void> {
    console.log(`Iniciando backfill de Product.averageCost y SaleDetail.unitCostAtSale${isDryRun ? ' (DRY RUN, no se escribirá nada en la DB)' : ''}...`);

    const dataSource = await getDataSource();

    const productRepository = await TypeOrmProductRepository.create();
    const lotRepository = await TypeOrmLotRepository.create();
    const saleDetailRepository = await TypeormSaleDetailRepository.create();
    const recalculateUseCase = new RecalculateProductAverageCostUseCase(productRepository, lotRepository, saleDetailRepository);

    // Solo necesitamos productId + name (para logs de error legibles) de cada producto.
    const productOrmRepository = dataSource.getRepository(ProductOrmEntity);
    const products = await productOrmRepository.find({ select: ['productId', 'name'] });

    console.log(`Se encontraron ${products.length} productos. Recalculando costo promedio (1/2)...`);

    let processedProducts = 0;
    const failedProducts: FailedProduct[] = [];
    const averageCostByProductId = new Map<string, number>();

    for (const product of products) {
        try {
            if (isDryRun) {
                // calculate() hace el mismo cálculo FIFO que execute(), pero de solo lectura: no
                // llama a updateAverageCost(). Permite previsualizar el valor real sin escribir.
                const previewAverageCost = await recalculateUseCase.calculate(product.productId);
                averageCostByProductId.set(product.productId.toString(), previewAverageCost);
                console.log(`  [dry-run] Producto ${product.productId} (${product.name}): averageCost recalculado sería ${previewAverageCost}.`);
            } else {
                const updated = await recalculateUseCase.execute(product.productId);
                averageCostByProductId.set(product.productId.toString(), updated.averageCost);
            }
            processedProducts++;
        } catch (error: any) {
            const message = error?.message ?? String(error);
            failedProducts.push({ productId: product.productId, name: product.name, error: message });
            console.error(`  ✗ Error recalculando producto ${product.productId} (${product.name}): ${message}`);
        }
    }

    console.log(`Costo promedio recalculado para ${processedProducts}/${products.length} productos.`);
    if (failedProducts.length > 0) {
        console.warn(`${failedProducts.length} productos fallaron al recalcular (revisar manualmente, quedaron con su averageCost anterior).`);
    }

    // 2. Rellena sale_detail.unit_cost_at_sale IS NULL con el averageCost recién calculado del
    //    producto correspondiente. Un UPDATE por producto (no fila por fila) — mucho más rápido
    //    para el volumen típico de sale_detail de un POS de tienda.
    console.log('Rellenando sale_detail.unit_cost_at_sale para filas históricas (NULL) (2/2)...');

    const pendingBefore = await dataSource.query(
        `SELECT COUNT(*)::int AS count FROM sale_detail WHERE unit_cost_at_sale IS NULL`,
    );
    const pendingCountBefore: number = pendingBefore[0]?.count ?? 0;
    console.log(`  Filas de sale_detail con unit_cost_at_sale NULL antes del backfill: ${pendingCountBefore}`);

    let productsWithSaleDetailsUpdated = 0;
    for (const product of products) {
        const averageCost = averageCostByProductId.get(product.productId.toString());
        // Si el producto falló al recalcular, se omite: mejor dejar esas filas en NULL
        // (visibles/reconocibles como pendientes) que rellenarlas con un costo no confiable.
        if (averageCost === undefined) continue;

        if (isDryRun) {
            console.log(`  [dry-run] Producto ${product.productId} (${product.name}): se rellenarían sus sale_detail NULL con averageCost=${averageCost}.`);
            continue;
        }

        await dataSource.query(
            `UPDATE sale_detail SET unit_cost_at_sale = $1 WHERE product_id = $2 AND unit_cost_at_sale IS NULL`,
            [averageCost, product.productId],
        );
        productsWithSaleDetailsUpdated++;
    }

    const pendingAfter = await dataSource.query(
        `SELECT COUNT(*)::int AS count FROM sale_detail WHERE unit_cost_at_sale IS NULL`,
    );
    const pendingCountAfter: number = isDryRun ? pendingCountBefore : (pendingAfter[0]?.count ?? 0);

    console.log('--- Resumen del backfill ---');
    console.log(`Productos procesados: ${processedProducts}/${products.length}`);
    console.log(`Productos con error al recalcular: ${failedProducts.length}`);
    console.log(`sale_detail.unit_cost_at_sale NULL antes: ${pendingCountBefore}`);
    console.log(`sale_detail.unit_cost_at_sale NULL después${isDryRun ? ' (estimado, dry-run)' : ''}: ${pendingCountAfter}`);
    if (failedProducts.length > 0) {
        console.log('Productos con error (revisar manualmente):');
        failedProducts.forEach(item => console.log(`  - productId=${item.productId} name="${item.name}": ${item.error}`));
    }

    await dataSource.destroy();
}

backfillAverageCost()
    .then(() => {
        console.log('Backfill finalizado.');
        process.exit(0);
    })
    .catch((error) => {
        console.error('Backfill finalizado con errores no controlados:', error);
        process.exit(1);
    });
