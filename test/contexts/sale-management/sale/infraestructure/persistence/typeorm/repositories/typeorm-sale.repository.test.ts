/** @jest-environment node */
import { DataSource } from "typeorm";
import { createPgMemCloudTransferDataSource } from "../../../../../../inventory-management/cloud-transfer/test-utils/create-pgmem-cloud-transfer-datasource";
import { TypeormSaleRepository } from "@/contexts/sale-management/sale/infraestructure/persistence/typeorm/repositories/typeorm-sale.repository";
import { TypeormTransactionDBRepository } from "@/configuration/databases/typeorm/transaction-db/infraestructure/repositories/TypeormTransactionDBRepository";
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
 * Los detalles se insertan con ids fuera de orden (3, 1, 2). Sin `ORDER BY` la consulta devolvería el orden
 * físico (el de inserción); con el orden explícito deben salir 1, 2, 3, que es el orden de llegada a la venta.
 */
describe("TypeormSaleRepository: orden de los detalles de venta", () => {
    let dataSource: DataSource;
    let repository: TypeormSaleRepository;
    let saleId: bigint;

    beforeAll(async () => {
        dataSource = await createPgMemCloudTransferDataSource();
        repository = new TypeormSaleRepository(dataSource, new TypeormTransactionDBRepository(dataSource));

        const establishment = await dataSource.getRepository(EstablishmentOrmEntity).save({ name: "Tienda" });
        const address = await dataSource.getRepository(AddressOrmEntity).save({
            municipality: "Centro", city: "Centro", state: "Centro", postalCode: "00000", country: "MX",
        });
        const branchOffice = await dataSource.getRepository(BranchOfficeOrmEntity).save({
            establishmentId: establishment.establishmentId, addressId: address.addressId, name: "Matriz",
        });
        const employeeRole = await dataSource.getRepository(EmployeeRoleOrmEntity).save({ name: "Cajero" });
        const employee = await dataSource.getRepository(EmployeeOrmEntity).save({
            branchOfficeId: branchOffice.branchOfficeId, employeeRoleId: employeeRole.employeeRoleId,
            firstName: "Ana", lastName: "Cajera", isActive: true,
        });
        const category = await dataSource.getRepository(CategoryOrmEntity).save({
            establishmentId: establishment.establishmentId, name: "Abarrotes", description: null,
        });
        const brand = await dataSource.getRepository(BrandOrmEntity).save({
            establishmentId: establishment.establishmentId, name: "Marca",
        });
        const product = await dataSource.getRepository(ProductOrmEntity).save({
            establishmentId: establishment.establishmentId, categoryId: category.categoryId, brandId: brand.brandId,
            name: "Producto", sku: null, universalBarCode: "BC-1", description: null,
            unitOfMeasure: ForSaleEnum.PC, minStockGlobal: null, imageUrl: null, averageCost: "10",
        });
        const inventory = await dataSource.getRepository(InventoryOrmEntity).save({
            productId: product.productId, branchOfficeId: branchOffice.branchOfficeId, isSellable: true,
            salePriceOne: 15, salePriceMany: null, saleQuantityMany: null, salePriceSpecial: null,
            minStockBranch: null, maxStockBranch: null,
        });
        const customer = await dataSource.getRepository(CustomerOrmEntity).save({
            establishmentId: establishment.establishmentId, firstName: "Público en general", saleDefault: true,
        });
        const cashRegister = await dataSource.getRepository(CashRegisterOrmEntity).save({
            branchOfficeId: branchOffice.branchOfficeId, name: "Caja 1",
        });
        const cashSession = await dataSource.getRepository(CashSessionOrmEntity).save({
            cashRegisterId: cashRegister.cashRegisterId, employeeId: employee.employeeId,
            startTime: new Date(), startBalance: 500,
        });
        const sale = await dataSource.getRepository(SaleOrmEntity).save({
            branchOfficeId: branchOffice.branchOfficeId, customerId: customer.customerId,
            employeeId: employee.employeeId, cashSessionId: cashSession.cashSessionId,
            status: SaleStatusEnum.INITIALIZED,
        });
        saleId = sale.saleId;

        for (const id of [3, 1, 2]) {
            await dataSource.getRepository(SaleDetailOrmEntity).insert({
                saleDetailId: BigInt(id), saleId, productId: product.productId, inventoryId: inventory.inventoryId,
                productNameAtSale: `Producto ${id}`, productBarCodeAtSale: `BC-${id}`,
                productUnitAtSale: ForSaleEnum.PC, quantity: 1, unitPriceAtSale: 15, regularPriceAtSale: 15,
                saleFor: SaleForEnum.ONE, subtotalItem: 15,
            } as unknown as SaleDetailOrmEntity);
        }
    });

    afterAll(async () => {
        await dataSource.destroy();
    });

    const detailIds = (sale: { saleDetails: { saleDetailId: bigint }[] | null } | null) =>
        (sale?.saleDetails ?? []).map(detail => Number(detail.saleDetailId));

    it("findById devuelve los detalles en orden de llegada", async () => {
        expect(detailIds(await repository.findById(saleId))).toEqual([1, 2, 3]);
    });

    it("cambiar la cantidad de un producto no lo mueve de lugar", async () => {
        await dataSource.getRepository(SaleDetailOrmEntity).update({ saleDetailId: BigInt(1) }, { quantity: 5 } as never);

        expect(detailIds(await repository.findById(saleId))).toEqual([1, 2, 3]);
    });

    it("el ticket y el detalle de venta usan el mismo orden", async () => {
        expect(detailIds(await repository.findSaleTicketById(saleId))).toEqual([1, 2, 3]);
        expect(detailIds(await repository.findFinishSaleById(saleId))).toEqual([1, 2, 3]);
    });
});
