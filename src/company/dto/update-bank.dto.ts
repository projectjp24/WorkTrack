import { PartialType } from "@nestjs/mapped-types";
import { CreateBankDto } from "./create-bank.dto";
import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsBoolean, IsOptional } from "class-validator";

export class UpdateBankDto extends PartialType(CreateBankDto){
  @IsOptional()
  @IsBoolean()
  @ApiPropertyOptional()
  is_active?: boolean;
}