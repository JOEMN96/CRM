import { Controller, Get, Req, Post, Body, Delete } from '@nestjs/common';
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
  getUsersProjectsById(@Req() req: Request) {
    const user = req.user as Payload;
    return this.projectService.getUsersProjectsById(user.id);
  }

  @Roles(Role.ADMIN, Role.SUPERADMIN)
  @Get('')
  getAllProjects() {
    return this.projectService.getAllprojects();
  }

  @Roles(Role.ADMIN, Role.SUPERADMIN)
  @Post('create')
  createNewProject(
    @Body() projectDto: CreateNewProject,
    @User() user: Payload,
  ) {
    return this.projectService.createNewProject(projectDto, user.id);
  }

  @Roles(Role.ADMIN, Role.SUPERADMIN)
  @Delete('')
  deleteProjectByName(@Body() projectDto: DeleteProjectByName) {
    return this.projectService.deleteProjectByName(projectDto.name);
  }

  @Roles(Role.ADMIN, Role.SUPERADMIN)
  @Post('addUser')
  addUserToProject(@Body() dto: AddUserToProject) {
    return this.projectService.addUserToProject(dto);
  }
}
