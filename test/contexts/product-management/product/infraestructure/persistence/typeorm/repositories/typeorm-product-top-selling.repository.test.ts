/** @jest-environment node */
import { DataSource } from "typeorm";
import { createPgMemCloudTransferDataSource } from "../../../../../../inventory-management/cloud-transfer/test-utils/create-pgmem-cloud-transfer-datasource";
import { TypeOrmProductRepository } from "@/contexts/product-management/product/infraestructure/persistence/typeorm/repositories/typeorm-product.repository";
import { FilterTopEnum } from "@/contexts/product-management/product/domain/enums/FilterTopEnum";
import { TopSellingProductsCriteria } from "@/contexts/product-management/product/domain/read-models/top-selling-product.read-model";
import { EstablishmentOrmEntity } from "@/contexts/establishment-management/establishment/infraestruture/persistence/typeorm/entities/establishment-orm-entity";
import { AddressOrmEntity } from "@/contexts/establishment-management/address/infraestructure/entities/address.orm-entity";
import { BranchOfficeOrmEntity } from "@/contexts/establishment-management/branch-office/infraestructure/persistence/typeorm/entities/branch-office.orm-entity";
import { EmployeeRoleOrmEntity } from "@/contexts/employee-management/employee-role/infraestruture/persistence/typeorm/entities/employee-role-orm-entity";
import { EmployeeOrmEntity } from "@/contexts/employee-management/employee/infraestruture/persistence/typeorm/entities/employee-orm-entity";
import { CategoryOrmEntity } from "@/contexts/product-management/category/infraestructure/persistence/typeorm/entities/category.orm-entity";
import { BrandOrmEntity } from "@/contexts/product-management/brand/infraestruture/persistence/typeorm/entities/brand-orm-entity";
import { ProductOrmEntity } from "@/contexts/product-management/product/infraestructure/persistence/typeorm/entities/product.orm-entity";
import { InventoryOrmEntity } from "@/contexts/inventory-management/inventory/infraestructure/persistence/typeorm/entities/inventory.orm-entity";
import { CustomerOrmEntity } from "@/contexts/sale-management/customer/infraestructure/persistence/typeorm/entities/customer.orm-entity";
import { CashRegisterOrmEntity } from "@/contexts/cash-management/cash-register/infraestructure/entities/cash-register.orm-entity";
import { CashSessionOrmEntity } from "@/contexts/cash-management/cash-session/infraestructure/entities/cash-session.orm-entity";
import { SaleOrmEntity } from "@/contexts/sale-management/sale/infraestructure/persistence/typeorm/entities/sale.orm-entity";
import { SaleDetailOrmEntity } from "@/contexts/sale-management/sale-detail/infraestructure/persistence/typeorm/entities/sale-detail.orm-entity";
import { SaleStatusEnum } from "@/contexts/sale-management/sale/domain/enums/sale-status.enum";
import { SaleForEnum } from "@/contexts/sale-management/sale/domain/enums/sale-for.enum";
import { ForSaleEnum } from "@/shared/domain/enums/for-sale.enum";

/**
 * Sucursal 1, noviembre 2026 (ventas COMPLETED):
 *   Cuaderno (Papelería) 10 uds / $50 · Pluma (Papelería) 3 uds / $300 · Arroz (Abarrotes) 5 uds / $100
 * Ruido que NO debe contar: venta de otra sucursal, venta sin completar y venta de octubre.
 */
// Sincronizar en pg-mem el grafo completo de entidades tarda varios segundos.
jest.setTimeout(30000);

describe("TypeOrmProductRepository.findTopSellingByBranchOffice", () => {
    let dataSource: DataSource;
    let repository: TypeOrmProductRepository;
    let branchOfficeId: bigint;
    let stationeryId: bigint;

    const november: Pick<TopSellingProductsCriteria, 'dateInit' | 'dateFinish'> = {
        dateInit: new Date(2026, 10, 1),
        dateFinish: new Date(2026, 11, 1),
    };

    beforeAll(async () => {
        dataSource = await createPgMemCloudTransferDataSource();
        repository = new TypeOrmProductRepository(dataSource);

        const establishment = await dataSource.getRepository(EstablishmentOrmEntity).save({ name: "Tienda" });
        // Cada sucursal tiene su propia dirección (relación 1:1).
        const [address, otherAddress] = await dataSource.getRepository(AddressOrmEntity).save([
            { municipality: "Centro", city: "Centro", state: "Centro", postalCode: "00000", country: "MX" },
            { municipality: "Norte", city: "Norte", state: "Norte", postalCode: "00001", country: "MX" },
        ]);
        const [branchOffice, otherBranchOffice] = await dataSource.getRepository(BranchOfficeOrmEntity).save([
            { establishmentId: establishment.establishmentId, addressId: address.addressId, name: "Matriz" },
            { establishmentId: establishment.establishmentId, addressId: otherAddress.addressId, name: "Sucursal 2" },
        ]);
        branchOfficeId = branchOffice.branchOfficeId;
        const employeeRole = await dataSource.getRepository(EmployeeRoleOrmEntity).save({ name: "Cajero" });
        const employee = await dataSource.getRepository(EmployeeOrmEntity).save({
            branchOfficeId, employeeRoleId: employeeRole.employeeRoleId,
            firstName: "Ana", lastName: "Cajera", isActive: true,
        });
        const [stationery, groceries] = await dataSource.getRepository(CategoryOrmEntity).save([
            { establishmentId: establishment.establishmentId, name: "Papelería", description: null },
            { establishmentId: establishment.establishmentId, name: "Abarrotes", description: null },
        ]);
        stationeryId = stationery.categoryId;
        const brand = await dataSource.getRepository(BrandOrmEntity).save({
            establishmentId: establishment.establishmentId, name: "Marca",
        });
        const customer = await dataSource.getRepository(CustomerOrmEntity).save({
            establishmentId: establishment.establishmentId, firstName: "Público en general", saleDefault: true,
        });
        const cashRegister = await dataSource.getRepository(CashRegisterOrmEntity).save({ branchOfficeId, name: "Caja 1" });
        const cashSession = await dataSource.getRepository(CashSessionOrmEntity).save({
            cashRegisterId: cashRegister.cashRegisterId, employeeId: employee.employeeId,
            startTime: new Date(), startBalance: 500,
        });

        const createProduct = async (name: string, categoryId: bigint) => {
            const product = await dataSource.getRepository(ProductOrmEntity).save({
                establishmentId: establishment.establishmentId, categoryId, brandId: brand.brandId,
                name, sku: null, universalBarCode: `BC-${name}`, description: null,
                unitOfMeasure: ForSaleEnum.PC, minStockGlobal: null, imageUrl: null, averageCost: "1",
            });
            const inventory = await dataSource.getRepository(InventoryOrmEntity).save({
                productId: product.productId, branchOfficeId, isSellable: true,
                salePriceOne: 1, salePriceMany: null, saleQuantityMany: null, salePriceSpecial: null,
                minStockBranch: null, maxStockBranch: null,
            });
            return { product, inventory };
        };
        const notebook = await createProduct("Cuaderno", stationery.categoryId);
        const pen = await createProduct("Pluma", stationery.categoryId);
        const rice = await createProduct("Arroz", groceries.categoryId);

        let nextDetailId = 1;
        const createSale = async (
            saleBranchOfficeId: bigint,
            status: SaleStatusEnum,
            createdAt: Date,
            lines: { item: { product: ProductOrmEntity; inventory: InventoryOrmEntity }; quantity: number; subtotal: number }[],
        ) => {
            const sale = await dataSource.getRepository(SaleOrmEntity).save({
                branchOfficeId: saleBranchOfficeId, customerId: customer.customerId,
                employeeId: employee.employeeId, cashSessionId: cashSession.cashSessionId, status,
            });
            await dataSource.getRepository(SaleOrmEntity).update({ saleId: sale.saleId }, { createdAt });
            for (const line of lines) {
                await dataSource.getRepository(SaleDetailOrmEntity).insert({
                    saleDetailId: BigInt(nextDetailId++), saleId: sale.saleId,
                    productId: line.item.product.productId, inventoryId: line.item.inventory.inventoryId,
                    productNameAtSale: line.item.product.name, productBarCodeAtSale: "BC",
                    productUnitAtSale: ForSaleEnum.PC, quantity: line.quantity, unitPriceAtSale: 1,
                    regularPriceAtSale: 1, saleFor: SaleForEnum.ONE, subtotalItem: line.subtotal,
                } as unknown as SaleDetailOrmEntity);
            }
        };

        // Dos ventas en noviembre: los totales se suman por producto.
        await createSale(branchOfficeId, SaleStatusEnum.COMPLETED, new Date(2026, 10, 3, 10), [
            { item: notebook, quantity: 4, subtotal: 20 },
            { item: pen, quantity: 3, subtotal: 300 },
        ]);
        await createSale(branchOfficeId, SaleStatusEnum.COMPLETED, new Date(2026, 10, 30, 23, 59), [
            { item: notebook, quantity: 6, subtotal: 30 },
            { item: rice, quantity: 5, subtotal: 100 },
        ]);
        // Ruido.
        await createSale(otherBranchOffice.branchOfficeId, SaleStatusEnum.COMPLETED, new Date(2026, 10, 10), [
            { item: rice, quantity: 100, subtotal: 9999 },
        ]);
        await createSale(branchOfficeId, SaleStatusEnum.INITIALIZED, new Date(2026, 10, 10), [
            { item: pen, quantity: 100, subtotal: 9999 },
        ]);
        await createSale(branchOfficeId, SaleStatusEnum.COMPLETED, new Date(2026, 9, 31, 23, 59), [
            { item: rice, quantity: 100, subtotal: 9999 },
        ]);
        await createSale(branchOfficeId, SaleStatusEnum.COMPLETED, new Date(2026, 11, 1, 0, 0), [
            { item: rice, quantity: 100, subtotal: 9999 },
        ]);
    });

    afterAll(async () => {
        await dataSource.destroy();
    });

    const names = (rows: { name: string }[]) => rows.map(row => row.name);

    it("ordena por unidades vendidas y suma solo ventas completadas de la sucursal dentro del periodo", async () => {
        const rows = await repository.findTopSellingByBranchOffice(branchOfficeId, {
            ...november, categoryId: null, orderBy: FilterTopEnum.QUANTITY_SALES, limit: 10,
        });

        expect(rows).toEqual([
            { productId: expect.any(BigInt), name: "Cuaderno", categoryName: "Papelería", quantitySales: 10, totalSales: 50 },
            { productId: expect.any(BigInt), name: "Arroz", categoryName: "Abarrotes", quantitySales: 5, totalSales: 100 },
            { productId: expect.any(BigInt), name: "Pluma", categoryName: "Papelería", quantitySales: 3, totalSales: 300 },
        ]);
    });

    it("ordena por monto vendido", async () => {
        const rows = await repository.findTopSellingByBranchOffice(branchOfficeId, {
            ...november, categoryId: null, orderBy: FilterTopEnum.TOTAL_SALES, limit: 10,
        });

        expect(names(rows)).toEqual(["Pluma", "Arroz", "Cuaderno"]);
    });

    it("filtra por categoría", async () => {
        const rows = await repository.findTopSellingByBranchOffice(branchOfficeId, {
            ...november, categoryId: stationeryId, orderBy: FilterTopEnum.QUANTITY_SALES, limit: 10,
        });

        expect(names(rows)).toEqual(["Cuaderno", "Pluma"]);
    });

    it("respeta el límite", async () => {
        const rows = await repository.findTopSellingByBranchOffice(branchOfficeId, {
            ...november, categoryId: null, orderBy: FilterTopEnum.QUANTITY_SALES, limit: 1,
        });

        expect(names(rows)).toEqual(["Cuaderno"]);
    });
});
