import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { UserOrmEntity } from "./user.orm-entity";
import { RoleOrmEntity } from "src/contexts/authentication-management/role/infraestructure/persistence/typeorm/entities/role.orm-entity";

@Entity({name: 'user_role'})
export class UserRoleOrmEntity{
    @PrimaryGeneratedColumn({ type: 'bigint', name: 'user_role_id' }) // Mapea a bigint en PostgreSQL
    userRoleId: bigint; // Usamos snake_case para la base de datos, camelCase para la propiedad JS
    @Column({type: 'bigint', name: 'user_id', nullable: false})
    userId: bigint;
    @Column({type: 'bigint', name: 'role_id', nullable: false})
    roleId: bigint;

    @CreateDateColumn({ type: 'timestamp with time zone', default: () => 'CURRENT_TIMESTAMP', name: 'created_at' })
    createdAt: Date;
    @UpdateDateColumn({ type: 'timestamp with time zone', nullable: true, name: 'updated_at' })
    updatedAt?: Date | null;
    @DeleteDateColumn({ type: 'timestamp with time zone', nullable: true, name: 'deleted_at' })
    deletedAt?: Date | null;

    @JoinColumn({name: 'user_id'})
    @ManyToOne(()=> UserOrmEntity, (user)=> user.userRoles, { cascade: true,  onDelete: 'CASCADE' })
    user?: UserOrmEntity | null;
    @JoinColumn({name: 'role_id'})
    @ManyToOne(()=>RoleOrmEntity, (role)=> role.userRoles)
    role?: RoleOrmEntity | null;
}