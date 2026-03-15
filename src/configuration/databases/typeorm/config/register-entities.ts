/**
 * Archivo de registro de entidades TypeORM
 * Este archivo debe importarse antes de llamar a getDataSource()
 * Se ejecuta en el middleware o en la configuración inicial de la aplicación
 */

import { entityRegistry } from './entities';

// Importar todas las entidades ORM
import { TemplateOrmEntity } from '@/shared/infrastructure/typeorm/template.orm-entity';
import { TransactionTypeOrmEntity } from '@/contexts/transaction-management/transaction-type/infraestructure/entities/transaction-type.orm-entity';
import { SalePaymentOrmEntity } from '@/contexts/sale-management/sale-payment/infraestructure/entities/sale-payment.orm-entity';
import { BrandOrmEntity } from '@/contexts/product-management/brand/infraestruture/persistence/typeorm/entities/brand-orm-entity';
import { SeasonOrmEntity } from '@/contexts/product-management/season/infraestructure/persistence/typeorm/entities/season.orm-entity';
import { TransactionOrmEntity } from '@/contexts/transaction-management/transaction/infraestructure/entities/transaction.orm-entity';
import { SaleDetailOrmEntity } from '@/contexts/sale-management/sale-detail/infraestructure/persistence/typeorm/entities/sale-detail.orm-entity';
import { TransferOrmEntity } from '@/contexts/inventory-management/transfer/infraestructure/entities/transfer.orm-entity';
import { SaleOrmEntity } from '@/contexts/sale-management/sale/infraestructure/persistence/typeorm/entities/sale.orm-entity';
import { EstablishmentOrmEntity } from '@/contexts/establishment-management/establishment/infraestruture/persistence/typeorm/entities/establishment-orm-entity';
import { ProductOrmEntity } from '@/contexts/product-management/product/infraestructure/persistence/typeorm/entities/product.orm-entity';
import { InventoryItemOrmEntity } from '@/contexts/inventory-management/inventory-item/infraestructure/persistence/typeorm/entities/inventory-item.orm-entity';
import { CategoryOrmEntity } from '@/contexts/product-management/category/infraestructure/persistence/typeorm/entities/category.orm-entity';
import { ReturnsOrmEntity } from '@/contexts/sale-management/returns/infraestructure/entities/returns.orm-entity';
import { BranchOfficeOrmEntity } from '@/contexts/establishment-management/branch-office/infraestructure/persistence/typeorm/entities/branch-office.orm-entity';
import { InventoryOrmEntity } from '@/contexts/inventory-management/inventory/infraestructure/persistence/typeorm/entities/inventory.orm-entity';
import { AddressOrmEntity } from '@/contexts/establishment-management/address/infraestructure/entities/address.orm-entity';
import { PaymentMethodOrmEntity } from '@/contexts/sale-management/payment-method/infraestructure/persistence/typeorm/entities/payment-method.orm-entity';
import { CustomerOrmEntity } from '@/contexts/sale-management/customer/infraestructure/persistence/typeorm/entities/customer.orm-entity';
import { SuplierOrmEntity } from '@/contexts/purchase-management/suplier/infraestructure/persistence/typeorm/entities/suplier.orm-entity';
import { EmployeeRoleOrmEntity } from '@/contexts/employee-management/employee-role/infraestruture/persistence/typeorm/entities/employee-role-orm-entity';
import { EmployeeOrmEntity } from '@/contexts/employee-management/employee/infraestruture/persistence/typeorm/entities/employee-orm-entity';
import { CashSessionOrmEntity } from '@/contexts/cash-management/cash-session/infraestructure/entities/cash-session.orm-entity';
import { CashRegisterOrmEntity } from '@/contexts/cash-management/cash-register/infraestructure/entities/cash-register.orm-entity';
import { LotUnitPurchaseOrmEntity } from '@/contexts/purchase-management/lot/infraestructura/persistence/typeorm/entities/lot-unit-purchase.orm-entity';
import { PermissionOrmEntity } from '@/contexts/authentication-management/permission/infraestructure/persistence/typeorm/entities/permission.orm-entity';
import { LotOrmEntity } from '@/contexts/purchase-management/lot/infraestructura/persistence/typeorm/entities/lot.orm-entity';
import { RolePermissionOrmEntity } from '@/contexts/authentication-management/role/infraestructure/persistence/typeorm/entities/role-permission.orm-entity';
import { RoleOrmEntity } from '@/contexts/authentication-management/role/infraestructure/persistence/typeorm/entities/role.orm-entity';
import { UserRoleOrmEntity } from '@/contexts/authentication-management/auth/infraestructure/entities/user-role.orm-entity';
import { UserOrmEntity } from '@/contexts/authentication-management/auth/infraestructure/entities/user.orm-entity';

/**
 * Registra todas las entidades de una sola vez
 */
export function registerAllEntities(): void {
  entityRegistry.registerBulk([
    TemplateOrmEntity,
    TransactionTypeOrmEntity,
    SalePaymentOrmEntity,
    BrandOrmEntity,
    SeasonOrmEntity,
    TransactionOrmEntity,
    SaleDetailOrmEntity,
    TransferOrmEntity,
    SaleOrmEntity,
    EstablishmentOrmEntity,
    ProductOrmEntity,
    InventoryItemOrmEntity,
    CategoryOrmEntity,
    ReturnsOrmEntity,
    BranchOfficeOrmEntity,
    InventoryOrmEntity,
    AddressOrmEntity,
    PaymentMethodOrmEntity,
    CustomerOrmEntity,
    SuplierOrmEntity,
    EmployeeRoleOrmEntity,
    EmployeeOrmEntity,
    CashSessionOrmEntity,
    CashRegisterOrmEntity,
    LotUnitPurchaseOrmEntity,
    PermissionOrmEntity,
    LotOrmEntity,
    RolePermissionOrmEntity,
    RoleOrmEntity,
    UserRoleOrmEntity,
    UserOrmEntity,
  ]);
}
