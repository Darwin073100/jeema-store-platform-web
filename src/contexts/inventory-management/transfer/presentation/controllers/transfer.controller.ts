import { BadRequestException, Body, ConflictException, Controller, Get, HttpCode, HttpStatus, NotFoundException, Param, ParseIntPipe, Post } from "@nestjs/common";
import { LocalTransferUseCase } from "../../application/use-cases/local-transfer.use-case";
import { LocalTransferRequestDTO } from "../dtos/local-transfer-request.dto";
import { TransferNotFoundException } from "../../domain/exceptions/transfer-not-found.exception";
import { TransferConflictException } from "../../domain/exceptions/transfer-conflict.exception";
import { TransferInvalidException } from "../../domain/exceptions/transfer-invalid.exception";
import { TransferMapper } from "../../application/mappers/transfer.mapper";
import { FindAllTransferByBranchOfficeUseCase } from "../../application/use-cases/find-all-transfer-by-branch-office.use-case";

@Controller('transfers')
export class TransferController{
    constructor(
        private readonly localTransferUseCase: LocalTransferUseCase,
        private readonly findAllTransferByBranchOfficeUseCase: FindAllTransferByBranchOfficeUseCase
    ){}

    @Post('/local-transfer')
    @HttpCode(HttpStatus.CREATED)
    async localTransfer(@Body() command: LocalTransferRequestDTO){
        try {
            const result = await this.localTransferUseCase.execute(command);
            return TransferMapper.toResponseDto(result);
        } catch (error) {
            if(error instanceof TransferNotFoundException){
                throw new NotFoundException(error.message);
            }
            if(error instanceof TransferConflictException){
                throw new ConflictException(error.message);
            }
            if(error instanceof TransferInvalidException){
                throw new BadRequestException(error.message);
            }
            throw error;
        }
    }
    @Get('all/branchOffices/:branchOfficeId')
    @HttpCode(HttpStatus.OK)
    async findAllTransferByBranch(@Param('branchOfficeId', ParseIntPipe) branchOfficeId: bigint){
        try {
            const result = await this.findAllTransferByBranchOfficeUseCase.execute(branchOfficeId);
            return {
                transfers: result.map(item => TransferMapper.toResponseDto(item)),
            };
        } catch (error) {
            if(error instanceof TransferNotFoundException){
                throw new NotFoundException(error.message);
            }
            if(error instanceof TransferConflictException){
                throw new ConflictException(error.message);
            }
            if(error instanceof TransferInvalidException){
                throw new BadRequestException(error.message);
            }
            throw error;
        }
    }
}