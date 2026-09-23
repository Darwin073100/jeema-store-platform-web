import 'reflect-metadata';
import { newDb } from 'pg-mem';
import { DataSource } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

import { EstablishmentOrmEntity } from '@/contexts/establishment-management/establishment/infraestruture/persistence/typeorm/entities/establishment-orm-entity';
import { BranchOfficeOrmEntity } from '@/contexts/establishment-management/branch-office/infraestructure/persistence/typeorm/entities/branch-office.orm-entity';
import { AddressOrmEntity } from '@/contexts/establishment-management/address/infraestructure/entities/address.orm-entity';
import { CategoryOrmEntity } from '@/contexts/product-management/category/infraestructure/persistence/typeorm/entities/category.orm-entity';
import { BrandOrmEntity } from '@/contexts/product-management/brand/infraestruture/persistence/typeorm/entities/brand-orm-entity';
import { SeasonOrmEntity } from '@/contexts/product-management/season/infraestructure/persistence/typeorm/entities/season.orm-entity';
import { ProductOrmEntity } from '@/contexts/product-management/product/infraestructure/persistence/typeorm/entities/product.orm-entity';
import { SuplierOrmEntity } from '@/contexts/purchase-management/suplier/infraestructure/persistence/typeorm/entities/suplier.orm-entity';
import { LotOrmEntity } from '@/contexts/purchase-management/lot/infraestructura/persistence/typeorm/entities/lot.orm-entity';
import { LotUnitPurchaseOrmEntity } from '@/contexts/purchase-management/lot/infraestructura/persistence/typeorm/entities/lot-unit-purchase.orm-entity';
import { EmployeeRoleOrmEntity } from '@/contexts/employee-management/employee-role/infraestruture/persistence/typeorm/entities/employee-role-orm-entity';
import { EmployeeOrmEntity } from '@/contexts/employee-management/employee/infraestruture/persistence/typeorm/entities/employee-orm-entity';
import { InventoryOrmEntity } from '@/contexts/inventory-management/inventory/infraestructure/persistence/typeorm/entities/inventory.orm-entity';
import { InventoryItemOrmEntity } from '@/contexts/inventory-management/inventory-item/infraestructure/persistence/typeorm/entities/inventory-item.orm-entity';
import { CustomerOrmEntity } from '@/contexts/sale-management/customer/infraestructure/persistence/typeorm/entities/customer.orm-entity';
import { PaymentMethodOrmEntity } from '@/contexts/sale-management/payment-method/infraestructure/persistence/typeorm/entities/payment-method.orm-entity';
import { SaleOrmEntity } from '@/contexts/sale-management/sale/infraestructure/persistence/typeorm/entities/sale.orm-entity';
import { SaleDetailOrmEntity } from '@/contexts/sale-management/sale-detail/infraestructure/persistence/typeorm/entities/sale-detail.orm-entity';
import { SalePaymentOrmEntity } from '@/contexts/sale-management/sale-payment/infraestructure/entities/sale-payment.orm-entity';
import { TransactionTypeOrmEntity } from '@/contexts/transaction-management/transaction-type/infraestructure/entities/transaction-type.orm-entity';
import { TransactionOrmEntity } from '@/contexts/transaction-management/transaction/infraestructure/entities/transaction.orm-entity';
import { TransferOrmEntity } from '@/contexts/inventory-management/transfer/infraestructure/entities/transfer.orm-entity';
import { CashRegisterOrmEntity } from '@/contexts/cash-management/cash-register/infraestructure/entities/cash-register.orm-entity';
import { CashSessionOrmEntity } from '@/contexts/cash-management/cash-session/infraestructure/entities/cash-session.orm-entity';
import { ReturnsOrmEntity } from '@/contexts/sale-management/returns/infraestructure/entities/returns.orm-entity';
import { EstablishmentDetailOrmEntity } from '@/contexts/establishment-management/establishment-detail/infraestructure/persistence/typeorm/entities/establishment-detail.orm-entity';
import { CloudTransferOrmEntity } from '@/contexts/inventory-management/cloud-transfer/infraestructure/entities/cloud-transfer.orm-entity';
import { CloudTransferItemOrmEntity } from '@/contexts/inventory-management/cloud-transfer/infraestructure/entities/cloud-transfer-item.orm-entity';
import { UserOrmEntity } from '@/contexts/authentication-management/auth/infraestructure/entities/user.orm-entity';
import { RoleOrmEntity } from '@/contexts/authentication-management/role/infraestructure/persistence/typeorm/entities/role.orm-entity';
import { UserRoleOrmEntity } from '@/contexts/authentication-management/auth/infraestructure/entities/user-role.orm-entity';
import { PermissionOrmEntity } from '@/contexts/authentication-management/permission/infraestructure/persistence/typeorm/entities/permission.orm-entity';
import { RolePermissionOrmEntity } from '@/contexts/authentication-management/role/infraestructure/persistence/typeorm/entities/role-permission.orm-entity';
import { ImageOrmEntity } from '@/contexts/image-management/image/infraestructura/persistence/typeorm/entities/image.orm-entity';
import { PrinterConfigurationOrmEntity } from '@/contexts/configuration-management/printer-configuration/infraestructura/persistence/typeorm/entities/printer-configuration.orm-entity';

/**
 * Crea un DataSource de TypeORM respaldado por pg-mem (Postgres en memoria), con el mismo set de entidades
 * que `src/configuration/databases/typeorm/config/config.ts` (menos User/Role/Permission/Image/Printer, que
 * no participan de ningún relation gráfico alcanzable desde `cloud-transfer` y se omiten para acotar el
 * grafo). Se necesita este universo amplio porque `CloudTransferOrmEntity`/`CloudTransferItemOrmEntity`
 * tienen `@ManyToOne` hacia `BranchOffice`/`Employee`/`Product`/`Category`/`Inventory`/`Lot`/
 * `InventoryItem`, y esas a su vez referencian otras entidades en sus propios decoradores de relación —
 * TypeORM exige que el grafo completo de entidades referenciadas esté registrado en el mismo DataSource.
 */
export async function createPgMemCloudTransferDataSource(): Promise<DataSource> {
  const db = newDb({ autoCreateForeignKeyIndices: true });

  // pg-mem no implementa estas funciones de Postgres por defecto; TypeORM las invoca al inicializar/migrar.
  db.public.registerFunction({ name: 'current_database', implementation: () => 'test' });
  db.public.registerFunction({ name: 'version', implementation: () => 'PostgreSQL 14.0' });
  db.public.registerFunction({
    name: 'uuid_generate_v4',
    implementation: () => uuidv4(),
  });

  const dataSource: DataSource = db.adapters.createTypeormDataSource({
    type: 'postgres',
    entities: [
      EstablishmentOrmEntity, AddressOrmEntity, BranchOfficeOrmEntity, CategoryOrmEntity, BrandOrmEntity,
      SeasonOrmEntity, ProductOrmEntity, SuplierOrmEntity, LotOrmEntity, EmployeeRoleOrmEntity,
      EmployeeOrmEntity, InventoryOrmEntity, InventoryItemOrmEntity, CustomerOrmEntity,
      LotUnitPurchaseOrmEntity, PaymentMethodOrmEntity, SaleOrmEntity, SaleDetailOrmEntity,
      SalePaymentOrmEntity, TransactionTypeOrmEntity, TransactionOrmEntity, TransferOrmEntity,
      CashRegisterOrmEntity, CashSessionOrmEntity, ReturnsOrmEntity, EstablishmentDetailOrmEntity,
      CloudTransferOrmEntity, CloudTransferItemOrmEntity, UserOrmEntity, RoleOrmEntity, UserRoleOrmEntity,
      PermissionOrmEntity, RolePermissionOrmEntity, ImageOrmEntity, PrinterConfigurationOrmEntity,
    ],
    // synchronize se dispara manualmente abajo (ver comentario) en vez de dejar que initialize() lo haga
    // automáticamente.
    synchronize: false,
  });

  await dataSource.initialize();

  // Workaround puntual, solo en este helper de test: pg-mem no soporta el default
  // `('now'::text)::date` que el driver Postgres de TypeORM genera para `default: () => 'CURRENT_DATE'`
  // en columnas `date` (ver `LotOrmEntity.receivedDate`, archivo de producción que este test NO modifica).
  // Se remueve ese default únicamente en la metadata en memoria de este DataSource de pg-mem —  los tests
  // siempre pasan `receivedDate` explícito al crear un `LotEntity`, así que no afecta ningún escenario.
  const lotMetadata = dataSource.getMetadata(LotOrmEntity);
  const receivedDateColumn = lotMetadata.columns.find((column) => column.propertyName === 'receivedDate');
  if (receivedDateColumn) {
    receivedDateColumn.default = undefined;
  }

  await dataSource.synchronize();
  return dataSource;
}
