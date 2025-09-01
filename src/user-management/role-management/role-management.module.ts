import { Controller, Get, Req } from "@nestjs/common";
import { RoleManagementService } from "./role-management.service";

@Controller('role-management')
export class RoleManagmentController {
    constructor(private readonly roleManagementService: RoleManagementService) {}

    @Get('allPermissions')
    async getAllRolesPermission(@Req() req: Request){
        return await this.roleManagementService.getAllRolesPermission({ select: ['*'] });
    }

    @Get('allRoles')
    async getAllRoles(@Req() req: Request){
        return await this.roleManagementService.getAllRoles({ select: ['*'] });
    }
}