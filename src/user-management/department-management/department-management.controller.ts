import { Controller, Get, Req } from "@nestjs/common";
import { DepartmentManagementService } from "./department-management.service";

@Controller('department-management')
export class DepartmentManagmentController {
    constructor(private readonly roleManagementService: DepartmentManagementService) {}


    @Get('allDepartments')
    async getAllRoles(@Req() req: Request){
        return await this.roleManagementService.getAllDepartment({ select: ['*'] });
    }
}