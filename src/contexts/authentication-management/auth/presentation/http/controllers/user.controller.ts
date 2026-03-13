import { BadRequestException, Body, ConflictException, Controller, Delete, Get, HttpCode, HttpStatus, NotFoundException, Param, ParseIntPipe, Patch, Post } from "@nestjs/common";
import { RegisterUserUseCase } from "../../../application/use-cases/register-user.use-case";
import { RegisterUserRequestDTO } from "../dtos/register-user.request.dto";
import { RegisterUserDTO } from "../../../application/dtos/register-user.dto";
import { UserMapper } from "../../../application/mapper/user.mapper";
import { UserRegisterResponseDTO } from "../../../application/dtos/user-register-response.dto";
import { InvalidUserException } from "../../../domain/exceptions/invalid-user.exception";
import { UserAlreadyExistsException } from "../../../domain/exceptions/user-already-exists.exception";
import { NotFoundRoleException } from "src/contexts/authentication-management/role/domain/exceptions/not-found-role.exception";
import { RegisterUserWithEmployeeUseCase } from "../../../application/use-cases/register-user-with-employee.use-case";
import { RegisterUserWithEmployeeRequestDTO } from "../dtos/register-user-with-employee.request.dto";
import { RegisterUserWithEmployeeDTO } from "../../../application/dtos/register-user-with-employee.dto";
import { FindAllByEstablishmentIdUseCase } from "../../../application/use-cases/find-all-by-establishment-id.use-case";
import { UpdateUserUseCase } from "../../../application/use-cases/update-user.use-case";
import { UpdateUserRequestDTO } from "../dtos/update-user.request.dto";
import { UpdateUserDTO } from "../../../application/dtos/update-user.dto";
import { UserNotFoundException } from "../../../domain/exceptions/user-not-found.exception";
import { ParseBigIntPipe } from "src/shared/pipes/parse-bigint.pipe";
import { AddRoleToUserUseCase } from "../../../application/use-cases/add-role-to-user.use-case";
import { AddRoleToUserRequestDTO } from "../dtos/add-role-to-user-request.dto";
import { AddRoleToUserDTO } from "../../../application/dtos/add-role-to-user.dto";
import { UpdateUserRoleRequestDTO } from "../dtos/update-user-role-request.dto";
import { UpdateUserRoleDTO } from "../../../application/dtos/update-user-role.dto";
import { UpdateUserRoleUseCase } from "../../../application/use-cases/update-user-role.use-case";
import { UserConflictException } from "../../../domain/exceptions/user-conflict.exception";
import { UserRoleMapper } from "../../../application/mapper/user-role.mapper";
import { UserRoleResponseDTO } from "../../../application/dtos/user-role-response.dto";
import { DeleteUserRoleUseCase } from "../../../application/use-cases/delete-user-role.use-case";

@Controller('users')
export class UserController{
    constructor(
        private readonly registerUserUseCase: RegisterUserUseCase,
        private readonly registerUserWithEmployeeUseCase: RegisterUserWithEmployeeUseCase,
        private readonly findAllByEstablishmentIdUseCase: FindAllByEstablishmentIdUseCase,
        private readonly updateUserUseCase: UpdateUserUseCase,
        private readonly addRoleToUserUseCase: AddRoleToUserUseCase,
        private readonly updateUserRoleUseCase: UpdateUserRoleUseCase,
        private readonly deleteUserRoleUseCase: DeleteUserRoleUseCase,
    ){}

    @Post()
    @HttpCode(HttpStatus.CREATED)
    async registerUser(@Body() registerUser:RegisterUserRequestDTO):Promise<UserRegisterResponseDTO>{
        try{
            const userDto = new RegisterUserDTO(registerUser.employeeId, registerUser.roleId,registerUser.username, registerUser.email,registerUser.password);
            
            const user = await this.registerUserUseCase.excecute(userDto);
            
            return UserMapper.toResponseDTO(user);
        } catch(error){
            if(error instanceof InvalidUserException){
                throw new BadRequestException(error.message);
            }

            if(error instanceof UserAlreadyExistsException){
                throw new ConflictException(error.message); 
            }

            if(error instanceof NotFoundRoleException){
                throw new NotFoundException(error.message);
            }
            throw error;
        }
    }
    @Post('with-employee')
    @HttpCode(HttpStatus.CREATED)
    async registerUserWithEmployee(@Body() registerUser:RegisterUserWithEmployeeRequestDTO):Promise<UserRegisterResponseDTO>{
        try{
            const userDto = new RegisterUserWithEmployeeDTO( 
                registerUser.branchOfficeId, 
                registerUser.username, 
                registerUser.email,
                registerUser.password,
                registerUser.firstName,
                registerUser.lastName,
                registerUser.phoneNumber,
            );
            
            const user = await this.registerUserWithEmployeeUseCase.excecute(userDto);
            
            return UserMapper.toResponseDTO(user);
        } catch(error){
            if(error instanceof InvalidUserException){
                throw new BadRequestException(error.message);
            }

            if(error instanceof UserAlreadyExistsException){
                throw new ConflictException(error.message); 
            }

            if(error instanceof NotFoundRoleException){
                throw new NotFoundException(error.message);
            }
            throw error;
        }
    }
    @Post('add-role')
    @HttpCode(HttpStatus.CREATED)
    async addRoleToUser(@Body() dto:AddRoleToUserRequestDTO):Promise<UserRoleResponseDTO>{
        try{
            const userDto = new AddRoleToUserDTO( 
                BigInt(dto.userId),
                BigInt(dto.roleId)
            );
            
            const userRole = await this.addRoleToUserUseCase.excecute(userDto);
            return UserRoleMapper.toResponse(userRole);
        } catch(error){
            if(error instanceof InvalidUserException){
                throw new BadRequestException(error.message);
            }
            if(error instanceof UserAlreadyExistsException){
                throw new ConflictException(error.message); 
            }
            if(error instanceof NotFoundRoleException){
                throw new NotFoundException(error.message);
            }
            if(error instanceof UserNotFoundException){
                throw new NotFoundException(error.message);
            }
            throw error;
        }
    }
    @Patch('user-role')
    @HttpCode(HttpStatus.OK)
    async updateUserRole(@Body() dto:UpdateUserRoleRequestDTO):Promise<UserRoleResponseDTO>{
        try{
            const userDto = new UpdateUserRoleDTO( 
                BigInt(dto.userRoleId),
                BigInt(dto.roleId)
            );
            const userRole = await this.updateUserRoleUseCase.excecute(userDto);
            return UserRoleMapper.toResponse(userRole);
        } catch(error){
            if(error instanceof InvalidUserException){
                throw new BadRequestException(error.message);
            }
            if(error instanceof UserAlreadyExistsException){
                throw new ConflictException(error.message); 
            }
            if(error instanceof NotFoundRoleException){
                throw new NotFoundException(error.message);
            }
            if(error instanceof UserNotFoundException){
                throw new NotFoundException(error.message);
            }
            if(error instanceof UserConflictException){
                throw new ConflictException(error.message);
            }
            throw error;
        }
    }

    @Get('all/establishments/:establishmentId')
    async findAllByEstablishmentId(@Param('establishmentId', ParseIntPipe) establishmentId: bigint){
        try {
            const result = await this.findAllByEstablishmentIdUseCase.execute(establishmentId);
            return {
                users: result.map(item => UserMapper.toResponseUserDTO(item))
            }
        } catch (error) {
            throw error;
        }
    }
    @Patch(':userId/establishments/:establishmentId')
    async updateUserState(
        @Param('userId', ParseBigIntPipe) userId: bigint,
        @Param('establishmentId', ParseBigIntPipe) establishmentId: bigint,
        @Body() command: UpdateUserRequestDTO
    ){
        try {
            const dto = new UpdateUserDTO(
                command.username,
                command.email,
                command.password,
                command.isActive
            )
            const result = await this.updateUserUseCase.execute(establishmentId, userId, dto);
            return UserMapper.toResponseUserDTO(result);
        } catch (error) {
            if(error instanceof UserNotFoundException){
                throw new NotFoundException(error.message);
            }
            if(error instanceof UserAlreadyExistsException){
                throw new ConflictException(error.message)
            }
            throw error;
        }
    }
    @Delete('user-role/:userRoleId')
    @HttpCode(HttpStatus.NO_CONTENT)
    async deleteUserRole(
        @Param('userRoleId', ParseBigIntPipe) userRoleId: bigint
    ){
        try {
            await this.deleteUserRoleUseCase.excecute(userRoleId);
        } catch (error) {
            if(error instanceof InvalidUserException){
                throw new BadRequestException(error.message);
            }
            if(error instanceof UserAlreadyExistsException){
                throw new ConflictException(error.message); 
            }
            if(error instanceof NotFoundRoleException){
                throw new NotFoundException(error.message);
            }
            if(error instanceof UserNotFoundException){
                throw new NotFoundException(error.message);
            }
            if(error instanceof UserConflictException){
                throw new ConflictException(error.message);
            }
            throw error;
        }
    }
}