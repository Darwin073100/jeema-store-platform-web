import { Entity, PrimaryGeneratedColumn, Column, Index, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import type { EstablishmentOrmEntity } from 'src/contexts/establishment-management/establishment/infraestruture/persistence/typeorm/entities/establishment-orm-entity';
import { EstablishmentDetailTypeEnum } from 'src/contexts/establishment-management/establishment-detail/domain/enums/establishment-detail-type.enum';

/**
 * EstablishmentDetailOrmEntity mapea la tabla `establishment_detail`: filas
 * tipadas ("dato extra") de un `Establishment` (teléfono, WhatsApp, correo,
 * sitio web, red social, slogan comercial), en relación 1:many real (FK)
 * con `Establishment` — a diferencia de `image`, que es polimórfica, aquí
 * el dueño siempre es `Establishment`, por lo que corresponde una FK real
 * con `onDelete: 'CASCADE'`.
 *
 * El índice compuesto `(establishment_id, type)` de abajo es sólo para
 * listar/filtrar rápido por tipo. La regla de negocio "máximo una fila
 * activa por establecimiento" para los tipos singleton (todos excepto
 * `PHONE_NUMBER`/`WHATSAPP`) se refuerza con un índice ÚNICO PARCIAL
 * definido a mano en la migración de esta feature (mismo mecanismo que
 * `IDX_image_primary_per_owner` en `image.orm-entity.ts`), porque ese
 * índice necesita un `WHERE` condicional que no aplica aquí vía decorador
 * simple.
 */
@Entity('establishment_detail')
@Index(['establishmentId', 'type'])
export class EstablishmentDetailOrmEntity {
  @PrimaryGeneratedColumn('increment', { type: 'bigint', name: 'establishment_detail_id' })
  establishmentDetailId: bigint;

  @Column({ type: 'bigint', name: 'establishment_id' })
  establishmentId: bigint;

  @Column({ type: 'enum', enum: EstablishmentDetailTypeEnum, name: 'type' })
  type: EstablishmentDetailTypeEnum;

  @Column({ type: 'varchar', length: 250 })
  value: string;

  @Column({ type: 'int', default: 0, name: 'sort_order' })
  sortOrder: number;

  @ManyToOne('EstablishmentOrmEntity', (establishment: EstablishmentOrmEntity) => establishment.details, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'establishment_id' })
  establishment: EstablishmentOrmEntity;

  @CreateDateColumn({ type: 'timestamp with time zone', name: 'created_at', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone', name: 'updated_at', nullable: true, onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt: Date | null;

  @DeleteDateColumn({ type: 'timestamp with time zone', name: 'deleted_at', nullable: true })
  deletedAt: Date | null;
}
