import { Injectable, Req } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { DepartmentEntity } from "../entities/department.entity";

@Injectable()
export class DepartmentManagementService {
    constructor(
        @InjectRepository(DepartmentEntity)
        private departmentRepository: Repository<DepartmentEntity>
    ) {}

    async getAllDepartment(p0: { select: string[] }){
        try {
            return await this.departmentRepository.find({
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