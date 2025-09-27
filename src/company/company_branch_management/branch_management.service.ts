import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CompanyBranch } from "../entities/company-branch.entity";

@Injectable()
export class BranchManagementService{
    constructor(
        @InjectRepository(CompanyBranch)
        private branchRepository: Repository<CompanyBranch>
    ){}

    async getAllBranch(company_id: string){
        try {
            return await this.branchRepository.find({
                where : {
                    company: { company_id },
                    is_deleted: false,
                    is_active: true,
                }
            })
        } catch (error) {
            throw error;
        }
    }
}