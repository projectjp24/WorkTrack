import { Injectable, NotFoundException, Req } from "@nestjs/common";
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

    async getAllRolesPermission(company_id: string){
        try {
            const rollDetails =  await this.rolePermissionRepository
            .createQueryBuilder('rp')
            .innerJoinAndSelect('rp.role', 'role')
            .innerJoinAndSelect('rp.permission', 'permission')
            .where('rp.is_deleted = :is_deleted and rp.is_active = :is_active',  { is_deleted: false, is_active: true })
            .andWhere('role.is_deleted = :is_deleted and role.is_active = :is_active', { is_deleted: false, is_active: true })
            .andWhere('permission.is_deleted = :is_deleted and permission.is_active = :is_active', { is_deleted: false, is_active: true })
            .andWhere('rp.company_id = :company_id', { company_id })
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

            if(!rollDetails || rollDetails.length === 0){
                throw new NotFoundException('No role permissions found for the company.');
            }

            return rollDetails;
            
        } catch (error) {
            throw error;   
        }
    }

    async getAllRoles(company_id: string){
        try {
            const roles = await this.roleRepository.find({
                where: {
                    company: { company_id },
                    is_deleted: false,
                    is_active: true,
                }
            });

            if(!roles || roles.length === 0){
                throw new NotFoundException('No roles found for the company.');
            }

            return roles;
        } catch (error) {
            throw error;
        }
    }
}