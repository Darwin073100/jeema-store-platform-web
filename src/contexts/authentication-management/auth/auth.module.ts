import { Module } from "@nestjs/common";
import { JwtModule, JwtService } from "@nestjs/jwt";
import { PassportModule } from '@nestjs/passport';
import { ENCRYPTION_REPOSITORY, EncryptionRepository } from "./domain/repositories/encryption.repository";
import { BcryptEncryptionRepository } from "./infraestructure/encryption/bcrypt.encryption.repository";
import { JwtStrategy } from "./infraestructure/strategy/jwt.strategy";
import { LocalStrategy } from "./infraestructure/strategy/local.strategy";
import { ValidateAuthUseCase } from "./application/use-cases/validate-auth.use-case";
import { loginAuthUseCase } from "./application/use-cases/login-auth.use-case";
import { AuthController } from "./presentation/http/controllers/auth.controller";
import { USER_REPOSITORY, UserRepository } from "./domain/repositories/user.repository";
import { UserOrmEntity } from "./infraestructure/entities/user.orm-entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TyperomUserRepository } from "./infraestructure/repositories/typeorm-user.repository";
import { RegisterUserUseCase } from "./application/use-cases/register-user.use-case";
import { UserController } from "./presentation/http/controllers/user.controller";
import { USER_ROLE_REPOSITORY, UserRoleRepository } from "./domain/repositories/user-role.repository";
import { TypeormUserRoleRepository } from "./infraestructure/repositories/typeorm-user-role.repository";
import { RoleModule } from "../role/role.module";
import { ROLE_CHECKER_PORT, RoleCheckerPort } from "../role/domain/ports/out/role-checker.port";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { GetUserProfileUseCase } from "./application/use-cases/get-user-profile.use-case";
import { EMPLOYEE_CHECKER_PORT, EmployeeChekerPort } from "src/contexts/employee-management/employee/domain/ports/out/employee-checker.port";
import { GetUserWorkspaceUseCase } from "./application/use-cases/get-user-workspace.use-case";
import { RegisterUserWithEmployeeUseCase } from "./application/use-cases/register-user-with-employee.use-case";
import { ROLE_REPOSITORY, RoleRepository } from "../role/domain/repositories/role.repository";
import { BRANCH_OFFICE_CHECKER_PORT, BranchOfficeCheckerPort } from "src/contexts/establishment-management/branch-office/domain/ports/out/branch-office-checker.port";
import { EMPLOYEE_ROLE_REPOSITORY, EmployeeRoleRepository } from "src/contexts/employee-management/employee-role/domain/repositories/employee-role.repository";
import { BranchOfficeModule } from "src/contexts/establishment-management/branch-office/branch-office.module";
import { EmployeeRoleModule } from "src/contexts/employee-management/employee-role/employee-role.module";
import { FindAllByEstablishmentIdUseCase } from "./application/use-cases/find-all-by-establishment-id.use-case";
import { ConnectionDBModule } from "src/config/database/typeorm/connection/connection-db.module";
import { UserRoleOrmEntity } from "./infraestructure/entities/user-role.orm-entity";
import { EmployeeSharedModule } from "src/contexts/employee-management/employee/employee-shared.module";
import { UpdateUserUseCase } from "./application/use-cases/update-user.use-case";
import { AddRoleToUserUseCase } from "./application/use-cases/add-role-to-user.use-case";
import { UpdateUserRoleUseCase } from "./application/use-cases/update-user-role.use-case";
import { DeleteUserRoleUseCase } from "./application/use-cases/delete-user-role.use-case";

@Module({
    imports: [
        TypeOrmModule.forFeature([UserOrmEntity, UserRoleOrmEntity]),
        RoleModule,
        EmployeeSharedModule,
        EmployeeRoleModule,
        BranchOfficeModule,
        PassportModule,
        JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '60m' },
      }),
      inject: [ConfigService],
    }),
    ConfigModule,
    ],
    providers:[
        {
            provide: USER_REPOSITORY,
            useClass: TyperomUserRepository
        },
        {
            provide: USER_ROLE_REPOSITORY,
            useClass: TypeormUserRoleRepository
        },
        {
            provide: ENCRYPTION_REPOSITORY,
            useClass: BcryptEncryptionRepository
        },
        {
            provide: RegisterUserUseCase,
            useFactory: (roleCheckerPort: RoleCheckerPort,employeeCheckerPort: EmployeeChekerPort, userRoleRepo: UserRoleRepository, encrypt: EncryptionRepository)=>{
                return new RegisterUserUseCase(roleCheckerPort, employeeCheckerPort, userRoleRepo, encrypt)
            },
            inject: [ROLE_CHECKER_PORT, EMPLOYEE_CHECKER_PORT, USER_ROLE_REPOSITORY, ENCRYPTION_REPOSITORY]
        },
        {
            provide: ValidateAuthUseCase,
            useFactory: (repo: UserRepository, encrypt: EncryptionRepository)=>{
                return new ValidateAuthUseCase(repo, encrypt)
            },
            inject: [USER_REPOSITORY, ENCRYPTION_REPOSITORY]
        },
        {
            provide: AddRoleToUserUseCase,
            useFactory: (userRoleRepo: UserRoleRepository,userRepo: UserRepository, roleRepo: RoleRepository)=>{
                return new AddRoleToUserUseCase(userRoleRepo, userRepo, roleRepo)
            },
            inject: [USER_ROLE_REPOSITORY, USER_REPOSITORY, ROLE_REPOSITORY]
        },
        {
            provide: UpdateUserRoleUseCase,
            useFactory: (userRoleRepo: UserRoleRepository, roleRepo: RoleRepository)=>{
                return new UpdateUserRoleUseCase(userRoleRepo, roleRepo)
            },
            inject: [USER_ROLE_REPOSITORY, ROLE_REPOSITORY]
        },
        {
            provide: DeleteUserRoleUseCase,
            useFactory: (userRoleRepo: UserRoleRepository )=>{
                return new DeleteUserRoleUseCase(userRoleRepo)
            },
            inject: [USER_ROLE_REPOSITORY]
        },
        {
            provide: FindAllByEstablishmentIdUseCase,
            useFactory: (repo: UserRepository)=>{
                return new FindAllByEstablishmentIdUseCase(repo)
            },
            inject: [USER_REPOSITORY]
        },
        {
            provide: JwtStrategy,
            useFactory: (repo: UserRepository)=>{
                return new JwtStrategy(repo);
            },
            inject: [USER_REPOSITORY]
        },
        {
            provide: loginAuthUseCase,
            useFactory: (jwtService: JwtService) => {
                return new loginAuthUseCase(jwtService);
            },
            inject: [JwtService]
        },
        {
            provide: GetUserProfileUseCase,
            useFactory: (userRepo: UserRepository) => {
                return new GetUserProfileUseCase(userRepo);
            },
            inject: [USER_REPOSITORY]
        },
        {
            provide: GetUserWorkspaceUseCase,
            useFactory: (userRepo: UserRepository) => {
                return new GetUserWorkspaceUseCase(userRepo);
            },
            inject: [USER_REPOSITORY]
        },
        {
            provide: UpdateUserUseCase,
            useFactory: (userRepo: UserRepository, encryptionRepo: EncryptionRepository) => {
                return new UpdateUserUseCase(userRepo, encryptionRepo);
            },
            inject: [USER_REPOSITORY, ENCRYPTION_REPOSITORY]
        },
        {
            provide: RegisterUserWithEmployeeUseCase,
            useFactory:(
                userRoleRepo: UserRoleRepository, branchRepo: BranchOfficeCheckerPort, emploRepo: EmployeeRoleRepository, 
                roleRepo: RoleRepository, encryptionRepo: EncryptionRepository)=>{
                return new RegisterUserWithEmployeeUseCase(userRoleRepo, branchRepo, emploRepo, roleRepo, encryptionRepo);
            },
            inject:[
                USER_ROLE_REPOSITORY, BRANCH_OFFICE_CHECKER_PORT, EMPLOYEE_ROLE_REPOSITORY, 
                ROLE_REPOSITORY, ENCRYPTION_REPOSITORY
            ]
        },
        JwtStrategy,
        LocalStrategy,

    ],
    controllers: [
        AuthController,
        UserController
    ],
    exports: [
        JwtModule, 
        PassportModule, 
        ENCRYPTION_REPOSITORY,
        USER_REPOSITORY,
        USER_ROLE_REPOSITORY,
    ] // Exportamos para que otros modulos lo puedan usar
})
export class AuthModule{}