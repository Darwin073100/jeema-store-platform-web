import { BadRequestException, Body, ConflictException, Controller, Get, HttpCode, HttpStatus, NotFoundException, Param, ParseIntPipe, Post, Put } from "@nestjs/common";
import { RegisterCashRegisterUseCase } from "../../application/use-cases/register-cash-register.use-case";
import { RegisterCashRegisterRequestDTO } from "../dtos/register-cash-register-request.dto";
import { CashRegisterMapper } from "../../application/mappers/cash-register.mapper";
import { CashRegisterInvalidException } from "../../domain/exceptions/cash-register-invalid.exception";
import { CashRegisterNotFoundException } from "../../domain/exceptions/cash-register-not-found.exception";
import { OpenCashSessionUseCase } from "src/contexts/cash-management/cash-session/application/use-cases/open-cash-session.use-case";
import { OpenCashSessionRequestDTO } from "src/contexts/cash-management/cash-session/presentation/dtos/open-cash-session-request.dto";
import { CashSessionInvalidException } from "src/contexts/cash-management/cash-session/domain/exceptions/cash-session-invalid.exception";
import { CashSessionNotFoundException } from "src/contexts/cash-management/cash-session/domain/exceptions/cash-session-not-found.exception";
import { CashSessionConflictException } from "src/contexts/cash-management/cash-session/domain/exceptions/cash-session-conflict.exception";
import { CashSessionMapper } from "src/contexts/cash-management/cash-session/application/mappers/cash-session.mapper";
import { FindAllCashRegisterByBranchOfficeIdUseCase } from "../../application/use-cases/find-all-cash-register-by-branch-office-id.use-case";
import { FindCashSessionByEmployeeIdUseCase } from "src/contexts/cash-management/cash-session/application/use-cases/find-cash-session-by-employee-id.use-case";
import { FindCashSessionWithTransactionsUseCase } from "src/contexts/cash-management/cash-session/application/use-cases/find-cash-session-with-transactions.use-case";
import { CloseCashSessionUseCase } from "src/contexts/cash-management/cash-session/application/use-cases/close-cash-session.use-case";
import { CloseCashSessionRequestDTO } from "src/contexts/cash-management/cash-session/presentation/dtos/close-cash-session-request.dto";
import { CloseCashSessionDTO } from "src/contexts/cash-management/cash-session/application/dtos/close-cash-session.dto";
import { FindCashMovementsByBranchOfficeUseCase } from "src/contexts/cash-management/cash-session/application/use-cases/find-cash-movements-by-branch-office-id.use-case";
import { ParseBigIntPipe } from "src/shared/pipes/parse-bigint.pipe";
import { FindCashSessionAllByBranchOfficeUseCase } from "src/contexts/cash-management/cash-session/application/use-cases/find-cash-session-all-by-branch-office-id.use-case";
import { FindCashSessionAllByBranchOfficeRequestDTO } from "src/contexts/cash-management/cash-session/presentation/dtos/find-cash-session-all-by-branch-office-request.dto";

@Controller('cash-registers')
export class CashRegisterController {
    constructor(
        private readonly registerCashRegisterUseCase: RegisterCashRegisterUseCase,
        private readonly openCashSessionUseCase: OpenCashSessionUseCase,
        private readonly closeCashSessionUseCase: CloseCashSessionUseCase,
        private readonly findAllCashRegisterByBranchOfficeIdUseCase: FindAllCashRegisterByBranchOfficeIdUseCase,
        private readonly findCashSessionByEmployeeIdUseCase: FindCashSessionByEmployeeIdUseCase,
        private readonly findCashSessionWithTransactionsUseCase: FindCashSessionWithTransactionsUseCase,
        private readonly findCashMovementsByBranchOfficeUseCase: FindCashMovementsByBranchOfficeUseCase,
        private readonly findCashSessionByBranchOfficeUseCase: FindCashSessionAllByBranchOfficeUseCase,
    ){}

    @Post()
    @HttpCode(HttpStatus.CREATED)
    async registerCashRegister(@Body() command: RegisterCashRegisterRequestDTO){
        try {
            const result = await this.registerCashRegisterUseCase.execute(command);
            return CashRegisterMapper.toResponse(result);
        } catch (error) {
            if(error instanceof CashRegisterInvalidException){
                throw new BadRequestException(error.message);
            }
            if(error instanceof CashRegisterNotFoundException){
                throw new NotFoundException(error.message);
            }
            throw error;
        }
    }
    @Post('all/sessions/all/branch-offices/:branchOfficeId')
    @HttpCode(HttpStatus.OK)
    async findCashByBranchOffice( 
        @Param('branchOfficeId', ParseBigIntPipe) branchOfficeId: bigint,
        @Body() dto: FindCashSessionAllByBranchOfficeRequestDTO
    ){
        try {
            const result = await this.findCashSessionByBranchOfficeUseCase.execute( branchOfficeId, dto.dateInit, dto.dateFinish );
            return {
                cashSessions: result.map(item => CashSessionMapper.toResponseDto(item))
            };
        } catch (error) {
            if(error instanceof CashSessionInvalidException){
                throw new BadRequestException(error.message);
            }
            if(error instanceof CashSessionNotFoundException){
                throw new NotFoundException(error.message);
            }
            if(error instanceof CashSessionConflictException){
                throw new ConflictException(error.message);
            }
            throw error;
        }
    }
    @Post(':id/sessions')
    @HttpCode(HttpStatus.CREATED)
    async openCashSession( @Param('id', ParseIntPipe) id: bigint, @Body() command: OpenCashSessionRequestDTO){
        try {
            const result = await this.openCashSessionUseCase.execute({
                ...command,
                cashRegisterId: id
            });
            return CashSessionMapper.toResponseDto(result);
        } catch (error) {
            if(error instanceof CashSessionInvalidException){
                throw new BadRequestException(error.message);
            }
            if(error instanceof CashSessionNotFoundException){
                throw new NotFoundException(error.message);
            }
            if(error instanceof CashSessionConflictException){
                throw new ConflictException(error.message);
            }
            throw error;
        }
    }
    @Get('all/sessions/all/branch-offices/:branchOfficeId')
    @HttpCode(HttpStatus.CREATED)
    async findCashMovementsByBranchOffice( @Param('branchOfficeId', ParseIntPipe) branchOfficeId: bigint){
        try {
            const result = await this.findCashMovementsByBranchOfficeUseCase.execute( branchOfficeId );
            return {
                cashSessions: result.map(item => CashSessionMapper.toResponseDto(item))
            };
        } catch (error) {
            if(error instanceof CashSessionInvalidException){
                throw new BadRequestException(error.message);
            }
            if(error instanceof CashSessionNotFoundException){
                throw new NotFoundException(error.message);
            }
            if(error instanceof CashSessionConflictException){
                throw new ConflictException(error.message);
            }
            throw error;
        }
    }
    @Put('sessions/:id')
    @HttpCode(HttpStatus.CREATED)
    async closeCashSession( @Param('id', ParseIntPipe) id: bigint, @Body() command: CloseCashSessionRequestDTO){
        try {
            const dto: CloseCashSessionDTO = {
                ...command,
                closingNotes: command.closingNotes ?? null
            } 
            const result = await this.closeCashSessionUseCase.execute( id, dto );
            return CashSessionMapper.toResponseDto(result);
        } catch (error) {
            if(error instanceof CashSessionInvalidException){
                throw new BadRequestException(error.message);
            }
            if(error instanceof CashSessionNotFoundException){
                throw new NotFoundException(error.message);
            }
            if(error instanceof CashSessionConflictException){
                throw new ConflictException(error.message);
            }
            throw error;
        }
    }

    @Get('all/branch-offices/:branchOfficeId')
    @HttpCode(HttpStatus.OK)
    async findAllCashRegisterByBranchOfficeId(@Param('branchOfficeId', ParseIntPipe) branchOfficeId: bigint){
        const result = await this.findAllCashRegisterByBranchOfficeIdUseCase.execute(branchOfficeId);
        return {
            cashRegisters: result.map(item => CashRegisterMapper.toResponse(item))
        }
    }
    @Get('sessions/one/employees/:employeeId')
    @HttpCode(HttpStatus.OK)
    async findCashSessionByEmployeeId(@Param('employeeId', ParseIntPipe) employeeId: bigint){
        try {
            const result = await this.findCashSessionByEmployeeIdUseCase.execute(employeeId);
            return CashSessionMapper.toResponseDto(result);
        } catch (error) {
            if(error instanceof CashSessionNotFoundException){
                throw new NotFoundException(error.message);
            }
            throw error;
        }
    }
    @Get('sessions/:cashSessionId/transactions')
    @HttpCode(HttpStatus.OK)
    async findCashSessionWithTransactions(@Param('cashSessionId', ParseIntPipe) cashSessionId: bigint){
        try {
            const result = await this.findCashSessionWithTransactionsUseCase.execute(cashSessionId);
            return CashSessionMapper.toResponseDto(result);
        } catch (error) {
            if(error instanceof CashSessionNotFoundException){
                throw new NotFoundException(error.message);
            }
            throw error;
        }
    }
}