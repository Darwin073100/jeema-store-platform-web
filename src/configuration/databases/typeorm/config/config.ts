import { DataSourceOptions } from 'typeorm';
import { EstablishmentOrmEntity } from 'src/contexts/establishment-management/establishment/infraestruture/persistence/typeorm/entities/establishment-orm-entity';
import { BranchOfficeOrmEntity } from 'src/contexts/establishment-management/branch-office/infraestructure/persistence/typeorm/entities/branch-office.orm-entity';
import { CategoryOrmEntity } from 'src/contexts/product-management/category/infraestructure/persistence/typeorm/entities/category.orm-entity';
import { BrandOrmEntity } from 'src/contexts/product-management/brand/infraestruture/persistence/typeorm/entities/brand-orm-entity';
import { SeasonOrmEntity } from 'src/contexts/product-management/season/infraestructure/persistence/typeorm/entities/season.orm-entity';
import { UserOrmEntity } from 'src/contexts/authentication-management/auth/infraestructure/entities/user.orm-entity';
import { RoleOrmEntity } from 'src/contexts/authentication-management/role/infraestructure/persistence/typeorm/entities/role.orm-entity';
import { UserRoleOrmEntity } from 'src/contexts/authentication-management/auth/infraestructure/entities/user-role.orm-entity';
import { PermissionOrmEntity } from 'src/contexts/authentication-management/permission/infraestructure/persistence/typeorm/entities/permission.orm-entity';
import { RolePermissionOrmEntity } from 'src/contexts/authentication-management/role/infraestructure/persistence/typeorm/entities/role-permission.orm-entity';
import { ProductOrmEntity } from 'src/contexts/product-management/product/infraestructure/persistence/typeorm/entities/product.orm-entity';
import { SuplierOrmEntity } from 'src/contexts/purchase-management/suplier/infraestructure/persistence/typeorm/entities/suplier.orm-entity';
import { LotOrmEntity } from 'src/contexts/purchase-management/lot/infraestructura/persistence/typeorm/entities/lot.orm-entity';
import { EmployeeRoleOrmEntity } from 'src/contexts/employee-management/employee-role/infraestruture/persistence/typeorm/entities/employee-role-orm-entity';
import { EmployeeOrmEntity } from 'src/contexts/employee-management/employee/infraestruture/persistence/typeorm/entities/employee-orm-entity';
import { InventoryOrmEntity } from 'src/contexts/inventory-management/inventory/infraestructure/persistence/typeorm/entities/inventory.orm-entity';
import { CustomerOrmEntity } from 'src/contexts/sale-management/customer/infraestructure/persistence/typeorm/entities/customer.orm-entity';
import { LotUnitPurchaseOrmEntity } from 'src/contexts/purchase-management/lot/infraestructura/persistence/typeorm/entities/lot-unit-purchase.orm-entity';
import { InventoryItemOrmEntity } from 'src/contexts/inventory-management/inventory-item/infraestructure/persistence/typeorm/entities/inventory-item.orm-entity';
import { PaymentMethodOrmEntity } from 'src/contexts/sale-management/payment-method/infraestructure/persistence/typeorm/entities/payment-method.orm-entity';
import { SaleOrmEntity } from 'src/contexts/sale-management/sale/infraestructure/persistence/typeorm/entities/sale.orm-entity';
import { SaleDetailOrmEntity } from 'src/contexts/sale-management/sale-detail/infraestructure/persistence/typeorm/entities/sale-detail.orm-entity';
import { SalePaymentOrmEntity } from 'src/contexts/sale-management/sale-payment/infraestructure/entities/sale-payment.orm-entity';
import { TransactionTypeOrmEntity } from 'src/contexts/transaction-management/transaction-type/infraestructure/entities/transaction-type.orm-entity';
import { TransactionOrmEntity } from 'src/contexts/transaction-management/transaction/infraestructure/entities/transaction.orm-entity';
import { TransferOrmEntity } from 'src/contexts/inventory-management/transfer/infraestructure/entities/transfer.orm-entity';
import { CashRegisterOrmEntity } from 'src/contexts/cash-management/cash-register/infraestructure/entities/cash-register.orm-entity';
import { CashSessionOrmEntity } from 'src/contexts/cash-management/cash-session/infraestructure/entities/cash-session.orm-entity';
import { ReturnsOrmEntity } from 'src/contexts/sale-management/returns/infraestructure/entities/returns.orm-entity';
import { AddressOrmEntity } from 'src/contexts/establishment-management/address/infraestructure/entities/address.orm-entity';
import { config } from 'dotenv';


/**
 * Configuración base de TypeORM
 * Se carga desde variables de entorno
 * 
 * Variables de entorno requeridas:
 * - DATABASE_URL: Conexión completa a PostgreSQL (ej: postgres://user:password@host:5432/dbname)
 * O alternativamente:
 * - DB_HOST, DB_PORT, DB_USERNAME, DB_PASSWORD, DB_NAME
 */
config();
export const getDataSourceConfig = (): DataSourceOptions => {
  const isProduction = process.env.NODE_ENV === 'production';
  const databaseUrl = process.env.DATABASE_URL;

  // Validar que existe la conexión
  if (!databaseUrl) {
    throw new Error(
      'Missing required environment variable: DATABASE_URL (ej: postgres://user:password@host:5432/dbname)'
    );
  }

  const config: DataSourceOptions = {
    type: 'postgres',
    url: databaseUrl,
    entities: [
      EstablishmentOrmEntity, AddressOrmEntity, BranchOfficeOrmEntity, CategoryOrmEntity, BrandOrmEntity,
      SeasonOrmEntity, UserOrmEntity, RoleOrmEntity, UserRoleOrmEntity, PermissionOrmEntity, RolePermissionOrmEntity,
      ProductOrmEntity, SuplierOrmEntity, LotOrmEntity, EmployeeRoleOrmEntity, EmployeeOrmEntity, InventoryOrmEntity,
      InventoryItemOrmEntity, CustomerOrmEntity, LotUnitPurchaseOrmEntity, PaymentMethodOrmEntity, SaleOrmEntity, 
      SaleDetailOrmEntity, SalePaymentOrmEntity, TransactionTypeOrmEntity, TransactionOrmEntity, TransferOrmEntity,
      CashRegisterOrmEntity, CashSessionOrmEntity, ReturnsOrmEntity
    ],
    synchronize: false,
    logging: process.env.DB_LOGGING === 'true',
    // ...(isProduction && {
    //   ssl: {
    //     rejectUnauthorized: false,
    //   },
    // }),
  };

  return config;
};
