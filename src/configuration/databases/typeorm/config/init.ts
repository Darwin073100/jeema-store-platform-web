/**
 * Inicializador de TypeORM para la aplicación
 * Este archivo debe ser importado al menos una vez durante el startup de la app
 *
 * Ubicación recomendada: root layout o middleware
 * Importar como: import '@/configuration/databases/typeorm/config/init'
 */

import 'reflect-metadata';

/**
 * IMPORTANTE: Importar todas las entidades ORM aquí para que se registren automáticamente
 * Las entidades deben tener el decorador @RegisterEntity()
 */

// ============== PRODUCT MANAGEMENT ==============

// Product Context
import '@/contexts/product-management/product1/infraestructure/persistence/typeorm/entities/product.orm-entity';

// Returns Feature
import '@/features/returns/domain/returns.entity';

// Sale Feature
import '@/features/sale/domain/sale.entity';

// Season Feature
import '@/features/season/domain/season.entity';

// Supplier Feature
import '@/features/suplier/domain/supplier.entity';

// Transaction Feature
import '@/features/transaction/domain/transaction.entity';

// Transfer Feature
import '@/features/transfer/domain/transfer.entity';

console.log('✓ TypeORM entities registered');
