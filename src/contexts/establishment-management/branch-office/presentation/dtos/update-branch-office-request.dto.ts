import { IsOptional, IsString } from "class-validator";

export class UpdateBranchOfficeRequestDto {
    @IsString({ message: 'El nombre no puede ser un número.' })
    @IsOptional()
    name?: string | null;
  }