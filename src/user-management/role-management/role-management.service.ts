import { Injectable, Req } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { RolePermissionEntity } from "../entities/roles-permission.entity";
import { RoleEntity } from "../entities/roles.entity";

@Injectable()
export class RoleManagementService {
    constructor(
        @InjectRepository(RolePermissionEntity)
        private rolePermissionRepository: Repository<RolePermissionEntity>,

        @InjectRepository(RoleEntity)
        private roleRepository: Repository<RoleEntity>
    ) {}

    async getAllRolesPermission(p0: { select: string[] }){
        try {
            const rollDetails =  await this.rolePermissionRepository
            .createQueryBuilder('rp')
            .innerJoinAndSelect('rp.role', 'role')
            .innerJoinAndSelect('rp.permission', 'permission')
            .where('rp.is_deleted = :is_deleted', { is_deleted: false, is_active: true })
            .select([
                'rp.role_permissions_id',
                'rp.role_id',
                'rp.permission_id',
                'role.role_name',
                'role.description',
                'permission.permission_name',
                'permission.permission_description',
            ])
            .getMany();

            return rollDetails;
            
        } catch (error) {
            throw error;   
        }
    }

    async getAllRoles(p0: { select: string[] }){
        try {
            return await this.roleRepository.find({
                where: {
                    is_deleted: false,
                    is_active: true,
                }
            });
        } catch (error) {
            throw error;
        }
    }
}