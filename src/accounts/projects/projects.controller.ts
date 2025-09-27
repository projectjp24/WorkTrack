// projects.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { ProjectDto } from 'src/invoice/dto/project.dto';
import { AuthGuard } from '@nestjs/passport';


@Controller('projects')
@UseGuards(AuthGuard('jwt')) 
export class ProjectsController {
  private readonly logger = new Logger(ProjectsController.name);

  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  async create(
    @Body() createProjectDto: ProjectDto,
    @Req() req: any,
  ) {
    const userId = req.user.user_id;
    const companyId = req.user.company_id;
    const project = await this.projectsService.create(createProjectDto, userId, companyId);
    
    return {
      statusCode: HttpStatus.CREATED,
      message: 'Project created successfully',
      data: project,
    };
  }

  @Get()
  async findAll(@Req() req: any) {
    const companyId = req.user.company_id;
    
    this.logger.log(`Fetching all projects for company: ${companyId}`);
    
    const projects = await this.projectsService.findAllByCompany(companyId);
    
    return {
      statusCode: HttpStatus.OK,
      message: 'Projects retrieved successfully',
      data: projects,
    };
  }

  @Get(':project_id')
  async findOne(@Param('project_id') project_id: string, @Req() req: any) {
    const companyId = req.user.company_id;
    
    this.logger.log(`Fetching project: ${ project_id} for company: ${companyId}`);
    
    const project = await this.projectsService.findOneWithFinancials( project_id, companyId);
    
    return {
      statusCode: HttpStatus.OK,
      message: 'Project retrieved successfully',
      data: project,
    };
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateProjectDto: UpdateProjectDto,
    @Req() req: any,
  ) {
    const userId = req.user.id;
    const companyId = req.user.company_id;
    
    this.logger.log(`Updating project: ${id} by user: ${userId}`);
    
    const project = await this.projectsService.update(id, updateProjectDto, userId, companyId);
    
    return {
      statusCode: HttpStatus.OK,
      message: 'Project updated successfully',
      data: project,
    };
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Req() req: any) {
    const companyId = req.user.company_id;
    
    this.logger.log(`Deleting project: ${id} for company: ${companyId}`);
    
    const result = await this.projectsService.remove(id, companyId);
    
    return {
      statusCode: HttpStatus.OK,
      message: 'Project deleted successfully',
      data: result,
    };
  }
}
