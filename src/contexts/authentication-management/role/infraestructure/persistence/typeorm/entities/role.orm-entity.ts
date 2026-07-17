import type { UserRoleOrmEntity } from "src/contexts/authentication-management/auth/infraestructure/entities/user-role.orm-entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import type { RolePermissionOrmEntity } from "./role-permission.orm-entity";

@Entity({name: 'role'})
export class RoleOrmEntity{
    @PrimaryGeneratedColumn('increment', { type: 'bigint', name: 'role_id' })
    roleId: bigint; // Usamos bigint para corresponder con bigserial de PostgreSQL
    @Column({ type: 'varchar', length: 50, unique: true, nullable: false })
    name: string;
    @Column({name: 'description', type: 'text', nullable: true})
    description?: string|null;

    @CreateDateColumn({ type: 'timestamp with time zone', name: 'created_at', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;    
    @UpdateDateColumn({ type: 'timestamp with time zone', name: 'updated_at', nullable: true, onUpdate: 'CURRENT_TIMESTAMP' })
    updatedAt: Date | null;
    @DeleteDateColumn({ type: 'timestamp with time zone', name: 'deleted_at', nullable: true })
    deletedAt: Date | null;

    @OneToMany('UserRoleOrmEntity', (userRole: UserRoleOrmEntity)=>userRole.role)
    userRoles?: UserRoleOrmEntity[] | [];
    @OneToMany('RolePermissionOrmEntity', (rolePermission: RolePermissionOrmEntity)=>rolePermission.role)
    rolePermissions?: RolePermissionOrmEntity[] | [];
}