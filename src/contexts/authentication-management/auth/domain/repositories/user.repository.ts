import { UserEntity } from "../entities/user.entity";

export const USER_REPOSITORY = Symbol('USER_REPOSITORY');

export interface UserRepository{
    save(entity: UserEntity):Promise<UserEntity>;
    saveWithEmployee(entity: UserEntity):Promise<UserEntity>;
    findByEmail(email: string):Promise<UserEntity |null>;
    findByUsername(username: string):Promise<UserEntity |null>;
    findById(id: bigint):Promise<UserEntity |null>;
    findByIdWithWorkspace(id: bigint): Promise<UserEntity | null>;
    /**
     * Visualiza una lista de usuarios con la relacion de empleado, de un establecimeinto.
     * @param establishmentId
     */
    findAllByEstablishmentId(establishmentId: bigint):Promise<UserEntity[]>;
    update(establishmentId: bigint,user: UserEntity): Promise<UserEntity>;
    existById(userId: bigint):Promise<UserEntity|null>;
}