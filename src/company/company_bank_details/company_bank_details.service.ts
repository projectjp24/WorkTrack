import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CompanyBankEntity } from '../entities/company-bank-details.entity';
import { Not, Repository } from 'typeorm';
import { CreateBankDto } from '../dto/create-bank.dto';
import { UpdateBankDto } from '../dto/update-bank.dto';

@Injectable()
export class CompanyBankDetailsService {
  constructor(
    @InjectRepository(CompanyBankEntity)
    private bankRepository: Repository<CompanyBankEntity>,
  ) {}

  async addBank(createBankDto: CreateBankDto, company_id: string) {
    // Optional: check if bank account already exists for this company
    const existingBank = await this.bankRepository.findOne({
      where: { account_number: createBankDto.account_number, company_id },
    });

    if (existingBank) {
      throw new BadRequestException(
        'Bank account already exists for this company',
      );
    }

    const newBank = this.bankRepository.create({
      ...createBankDto,
      company_id,
      is_active: true,
    });

    return await this.bankRepository.save(newBank);
  }

  async findAll(company_id: string) {
    const banks = await this.bankRepository.find({
      where: {
        company_id: company_id,
        is_delete: false
      },
    });
    return banks;
  }

  async findBank(company_id: string, bank_id: string) {
    const banks = await this.bankRepository.findOne({
      where: {
        bank_detail_id: bank_id,
        company_id: company_id,
      },
    });
    return banks;
  }

  async update(
    bank_id: string,
    company_id: string,
    fields: Partial<UpdateBankDto>,
) {
    const bank = await this.findBank(company_id, bank_id);
    if (!bank) throw new NotFoundException('Bank Account not found');

    // Check if account_number is being updated
    if (fields.account_number) {
        // Check if any other bank has the same account number in the same company
        const existingBank = await this.bankRepository.findOne({
            where: {
                company_id,
                account_number: fields.account_number,
                bank_detail_id: Not(bank_id), // Exclude current bank
            },
        });

        if (existingBank) {
            throw new BadRequestException('Account number already exists.');
        }
    }

    // Update the bank with new fields
    Object.assign(bank, fields);

    const result = await this.bankRepository.save(bank);
    return result;
}

  async softDelete(bank_id: string, company_id:string){
    const bank = await this.findBank(company_id, bank_id);
    if (!bank) throw new NotFoundException('Bank Account not found');

    //update the is_deleted to true instide of removing the data
    await this.bankRepository.update(bank_id,{
      is_active: false,
      is_delete: true,
    })

    return { message: "bank has been deleted successfully"}
  }
}
