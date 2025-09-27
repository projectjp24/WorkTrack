import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsOptional, IsString } from "class-validator";

export class CreateVendorDto{
    @IsString()
    @IsOptional()
    @ApiProperty({example: '5e91975b-66a9-4bc3-ac01-a965fda10557', description:'uuid of company'})
    company_id: string;

    @IsString()
    @IsOptional()
    @ApiProperty({example: 'VEND-001', description:'auto generated vendor id form UI'})
    vendor_detail_id: string;

    @IsString()
    @IsOptional()
    @ApiProperty({example: 'Mahendra Nath', description:'name of the vendor'})
    name: string;

    @IsString()
    @IsOptional()
    @ApiProperty({example: 'Suyash Kadam', description:'name of the contact person of the vendor'})
    contact_person: string;

    @IsString()
    @IsOptional()
    @ApiProperty({example: 'mahendra@gmail.com', description:'email of the vendor'})
    email: string;

    @IsString()
    @IsOptional()
    @ApiProperty({example: '1234567890', description:'phone number of the vendor'})
    phone: string;

    @IsString()
    @IsOptional()
    @ApiProperty({example: 'MG road, indore', description:'address of the vendor'})
    address: string;

    @IsNumber()
    @IsOptional()
    @ApiProperty({example: 41, description:'state code of the vendor'})
    state_code: number;

    @IsString()
    @IsOptional()
    @ApiProperty({example: '2AA526FKOFKDI96D', description:'billing address of the vendor'})
    gstin: string;

    @IsString()
    @IsOptional()
    @ApiProperty({example: 'OWEJOP2912P', description:'PAN number of the vendor'})
    pan: string;

    @IsString()
    @IsOptional()
    @ApiProperty({example: 'Active', description:'status of the vendor'})
    status: string;

    @IsString()
    @IsOptional()
    @ApiProperty({example: 'SBI', description:'vendor bank name'})
    bank_name: string;

    @IsString()
    @IsOptional()
    @ApiProperty({example: '85236548569', description:'account number of the vendor'})
    account_number: string;

    @IsString()
    @IsOptional()
    @ApiProperty({example: 'SBIN001', description:'ifsc code of bank of the vendor'})
    ifsc_code: string;

    @IsString()
    @IsOptional()
    @ApiProperty({example: 'Indore', description:'bank branch of the vendor'})
    branch: string;
}