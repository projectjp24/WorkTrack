import { Controller, Get, Param } from "@nestjs/common";
import { BranchManagementService } from "./branch_management.service";

@Controller('branch-management')
export class BranchManagementController{
    constructor(private readonly branchManagementService: BranchManagementService){}

    @Get('allBranch/:company_id')
    async getAllBranch(@Param('company_id')company_id: string){
        return await this.branchManagementService.getAllBranch(company_id);
    }
}