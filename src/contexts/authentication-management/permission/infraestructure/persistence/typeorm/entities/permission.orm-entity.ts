import { RolePermissionOrmEntity } from "src/contexts/authentication-management/role/infraestructure/persistence/typeorm/entities/role-permission.orm-entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity({name: 'permission'})
export class PermissionOrmEntity{
    @PrimaryGeneratedColumn('increment', { type: 'bigint', name: 'permission_id' })
    permissionId: bigint;
    @Column({ type: 'varchar', length: 100, unique: true, nullable: false })
    name: string;
    @Column({name: 'description', type: 'text', nullable: true})
    description?: string|null;

    @CreateDateColumn({ type: 'timestamp with time zone', name: 'created_at', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;
    @UpdateDateColumn({ type: 'timestamp with time zone', name: 'updated_at', nullable: true, onUpdate: 'CURRENT_TIMESTAMP' })
    updatedAt: Date | null;
    @DeleteDateColumn({ type: 'timestamp with time zone', name: 'deleted_at', nullable: true })
    deletedAt: Date | null;
    
    @OneToMany(()=> RolePermissionOrmEntity, (rolePermission)=>rolePermission.role)
    rolePermissions?: RolePermissionOrmEntity[] | [];
}