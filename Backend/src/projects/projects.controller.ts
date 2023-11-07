import {
  Controller,
  Get,
  Req,
  Post,
  Body,
  Delete,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { Role, Roles } from 'src/auth/common';
import { Request } from 'express';
import { Payload } from 'src/auth/types';
import { AddUserToProject, CreateNewProject, DeleteProjectByName } from './dto';
import { User } from 'src/utils';

@Controller('projects')
export class ProjectsController {
  constructor(private projectService: ProjectsService) {}

  @Get('projectsByUser')
  @HttpCode(HttpStatus.OK)
  getUsersProjectsById(@Req() req: Request) {
    const user = req.user as Payload;
    if (user.role === 'ADMIN' || user.role === 'SUPERADMIN') {
      return this.projectService.getAllprojects();
    }
    return this.projectService.getUsersProjectsById(user.id);
  }

  @Roles(Role.ADMIN, Role.SUPERADMIN)
  @Get('')
  @HttpCode(HttpStatus.OK)
  getAllProjects() {
    return this.projectService.getAllprojects();
  }

  @Roles(Role.ADMIN, Role.SUPERADMIN)
  @Post('create')
  @HttpCode(HttpStatus.CREATED)
  createNewProject(
    @Body() projectDto: CreateNewProject,
    @User() user: Payload,
  ) {
    return this.projectService.createNewProject(projectDto, user.id);
  }

  @Roles(Role.ADMIN, Role.SUPERADMIN)
  @Delete('')
  @HttpCode(HttpStatus.OK)
  deleteProjectByName(@Body() projectDto: DeleteProjectByName) {
    return this.projectService.deleteProjectByName(projectDto.name);
  }

  @Roles(Role.ADMIN, Role.SUPERADMIN)
  @Post('addUser')
  @HttpCode(HttpStatus.OK)
  addUserToProject(@Body() dto: AddUserToProject) {
    return this.projectService.addUserToProject(dto);
  }

  @Roles(Role.ADMIN, Role.SUPERADMIN)
  @Get('getPossibleProjectOwners')
  @HttpCode(HttpStatus.OK)
  getOwners() {
    return this.projectService.getPossibleProjectOwners();
  }
}
