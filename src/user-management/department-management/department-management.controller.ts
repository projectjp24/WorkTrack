import { Controller, Get, Param, Req } from "@nestjs/common";
import { DepartmentManagementService } from "./department-management.service";

@Controller('department-management')
export class DepartmentManagmentController {
    constructor(private readonly roleManagementService: DepartmentManagementService) {}


    @Get('allDepartments/:company_id')
    async getAllRoles(@Param('company_id')company_id: string){
        return await this.roleManagementService.getAllDepartment(company_id);
    }
}