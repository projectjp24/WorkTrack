import { Controller, Get, Param, Req } from "@nestjs/common";
import { DepartmentManagementService } from "./department-management.service";

@Controller('department-management')
export class DepartmentManagmentController {
    constructor(private readonly DepartmentManagementService: DepartmentManagementService) {}


    @Get('allDepartments/:company_id')
    async getAllDepartment(@Param('company_id')company_id: string){
        return await this.DepartmentManagementService.getAllDepartment(company_id);
    }
}