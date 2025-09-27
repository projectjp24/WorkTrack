// project.dto.ts
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsArray, IsDateString, IsEnum, IsNumber, IsOptional, IsString, IsUUID, ValidateNested } from "class-validator";
import { CreateIncomeCategoryDto } from "../../accounts/projects/dto/income-categories.dto";
import { ProjectExpenseCategory } from "../../accounts/projects/dto/expense-category.dto"; // ADDED THIS

export class ProjectDto {
  @ApiPropertyOptional({ description: 'Project UUID if using existing project', example: 'a47ac10b-58cc-4372-a567-0e02b2c3d480' })
  @IsOptional()
  @IsUUID()
  project_id?: string ;

  @ApiPropertyOptional({ description: 'Work order number', example: 'WO-2025-001' })
  @IsOptional()
  @IsString()
  work_order?: string;

  @ApiProperty({ description: 'Project name', example: 'Website Development' })
  @IsString()
  project_name: string;

  @ApiPropertyOptional({ description: 'Project work details and scope' })
  @IsOptional()
  @IsString()
  work_details_scope?: string;

  @ApiPropertyOptional({ 
    description: 'Project status',
    enum: ['Planning', 'Cancelled', 'On_Hold', 'Active', 'Completed'], 
    example: 'Planning' 
  })
  @IsOptional()
  @IsEnum(['Planning', 'Cancelled', 'On_Hold', 'Active', 'Completed'])
  project_status?: string;

  @ApiPropertyOptional({ description: 'Project start date', example: '2025-01-01' })
  @IsOptional()
  @IsDateString()
  start_date?: string;

  @ApiPropertyOptional({ description: 'Work order UUID' })
  @IsOptional()
  @IsUUID()
  work_order_id?: string;

  @ApiPropertyOptional({ description: 'Expected completion date', example: '2025-03-01' })
  @IsOptional()
  @IsDateString()
  expected_completion?: string;

  @ApiPropertyOptional({ description: 'Total project value', example: 100000.00 })
  @IsOptional()
  @IsNumber()
  project_value?: number;

  @ApiPropertyOptional({ description: 'Income categories for the project' })
  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CreateIncomeCategoryDto)
  incomeCategories?: CreateIncomeCategoryDto[];

  @ApiPropertyOptional({ description: 'Expense categories for the project' })
  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => ProjectExpenseCategory) 
  expenseCategories?: ProjectExpenseCategory[];
}
