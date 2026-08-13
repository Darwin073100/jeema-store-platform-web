import { Entity, PrimaryGeneratedColumn, Column, Index, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from 'typeorm';
import { ImageOwnerType } from 'src/contexts/image-management/image/domain/enums/image-owner-type.enum';

/**
 * ImageOrmEntity mapea la tabla `image`: asociación polimórfica genérica
 * (`owner_type` + `owner_id`) usada por producto, empleado y establecimiento.
 *
 * No hay FK real de Postgres hacia el dueño (una columna no puede apuntar a
 * tres tablas distintas) — la integridad se garantiza a nivel de aplicación
 * vía `ImageOwnerGatewayPort.exists()`. Ver spect/01_gestion_imagenes_spect.md,
 * sección "Seguridad e integridad".
 */
@Entity('image')
@Index('IDX_image_owner', ['ownerType', 'ownerId'])
@Index('IDX_image_primary_per_owner', ['ownerType', 'ownerId'], {
  unique: true,
  where: '"is_primary" = true AND "deleted_at" IS NULL',
})
export class ImageOrmEntity {
  @PrimaryGeneratedColumn('increment', { type: 'bigint', name: 'image_id' })
  imageId: bigint;

  @Column({ type: 'enum', enum: ImageOwnerType, name: 'owner_type' })
  ownerType: ImageOwnerType;

  @Column({ type: 'bigint', name: 'owner_id' })
  ownerId: bigint;

  @Column({ type: 'varchar', length: 500, name: 'storage_key' })
  storageKey: string;

  @Column({ type: 'varchar', length: 1000 })
  url: string;

  @Column({ type: 'varchar', length: 100, name: 'mime_type' })
  mimeType: string;

  @Column({ type: 'int', name: 'size_bytes' })
  sizeBytes: number;

  @Column({ type: 'boolean', name: 'is_primary', default: false })
  isPrimary: boolean;

  @Column({ type: 'int', name: 'sort_order', default: 1 })
  sortOrder: number;

  @CreateDateColumn({ type: 'timestamp with time zone', name: 'created_at', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone', name: 'updated_at', nullable: true, onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt: Date | null;

  @DeleteDateColumn({ type: 'timestamp with time zone', name: 'deleted_at', nullable: true })
  deletedAt: Date | null;
}
