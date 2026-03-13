import { Inject, Injectable } from "@nestjs/common";
import { BRANCH_OFFICE_CHECKER_PORT, BranchOfficeCheckerPort } from "src/contexts/establishment-management/branch-office/domain/ports/out/branch-office-checker.port";
import { DataSource, Repository } from "typeorm";
import { BranchOfficeOrmEntity } from "../entities/branch-office.orm-entity";

@Injectable()
export class BranchOfficeCheckerAdapter implements BranchOfficeCheckerPort {
  private readonly repository: Repository<BranchOfficeOrmEntity>;
  constructor(
    private readonly datasource: DataSource
  ){
    this.repository = this.datasource.getRepository(BranchOfficeOrmEntity);
  }
  async existById(branchOfficeId: bigint): Promise<boolean> {
    const branchOffice = await this.repository.existsBy({branchOfficeId});
    return !!branchOffice;
  }
}