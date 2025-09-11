import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsString, IsUUID } from "class-validator";

export class CreateBankDto {
    @ApiProperty({ description: 'Name of the bank', example: 'HDFC' })
    @IsString()
    bank_name: string;

    @ApiProperty({ description: 'Enter Account Number', example: '123456789' })
    @IsString()
    account_number: string;

    @ApiProperty({ description: 'Enter IFSC Code', example: 'HDFC0001' })
    @IsString()
    ifsc_code: string;

    @ApiProperty({ description: 'Enter branch name', example: 'Main Branch' })
    @IsString()
    branch_name: string;

    @ApiProperty({ description: 'Account type', example: 'savings'})
    @IsString()
    account_type: string;

    @ApiProperty({ description: 'User ID of creator (UUID)', example: 'a3e8d7c1-5c73-4d2c-bb93-12cdd9f4567a' })
    @IsString()
    createdBy: string;
    
    @ApiProperty({ description: 'User ID of updater (UUID)', example: 'b4f2e6d9-8a12-41e0-bbe3-98ad5f9cd567' })
    @IsString()
    updatedBy: string;

}