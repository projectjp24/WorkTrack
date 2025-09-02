import { Controller, Get, Req, Param } from "@nestjs/common";
import { RoleManagementService } from "./role-management.service";

@Controller('role-management')
export class RoleManagmentController {
    constructor(private readonly roleManagementService: RoleManagementService) {}

    @Get('allPermissions/:company_id')
    async getAllRolesPermission(@Param('company_id') company_id: string){
        return await this.roleManagementService.getAllRolesPermission(company_id);
    }

    @Get('allRoles/:company_id')
    async getAllRoles(@Param('company_id') company_id: string){
        return await this.roleManagementService.getAllRoles(company_id);
    }
}