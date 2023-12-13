import { Controller, Get, Req, Post, Body, Delete, HttpCode, HttpStatus, HttpException, Query } from '@nestjs/common';
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
  getUsersProjects(@Req() req: Request) {
    const user = req.user as Payload;
    if (user.role === 'ADMIN' || user.role === 'SUPERADMIN') {
      return this.projectService.getAllprojects();
    }
    return this.projectService.getUsersProjects(user.id);
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
  createNewProject(@Body() projectDto: CreateNewProject) {
    return this.projectService.createNewProject(projectDto);
  }

  @Roles(Role.ADMIN, Role.SUPERADMIN)
  @Delete('')
  @HttpCode(HttpStatus.OK)
  deleteProjectByName(@Body() projectDto: DeleteProjectByName) {
    return this.projectService.deleteProjectByName(projectDto.name);
  }

  @Roles(Role.ADMIN, Role.SUPERADMIN)
  @Post('addUsers')
  @HttpCode(HttpStatus.OK)
  addUsersToProject(@Body() dto: AddUserToProject) {
    return this.projectService.addUsersToProject(dto);
  }

  @Roles(Role.ADMIN, Role.SUPERADMIN)
  @Get('getPossibleProjectOwners')
  @HttpCode(HttpStatus.OK)
  getOwners() {
    return this.projectService.getPossibleProjectOwners();
  }

  @Roles(Role.ADMIN, Role.SUPERADMIN)
  @Get('getAssignedUsersForProject?')
  @HttpCode(HttpStatus.OK)
  getAllUsersAlongWithAssignedUsers(@Query('id') id: string) {
    if (!Number(id)) {
      throw new HttpException('Bad ID', HttpStatus.BAD_REQUEST);
    }
    return this.projectService.getAllUsersAlongWithAssignedUsers(Number(id));
  }

  @Roles(Role.ADMIN, Role.SUPERADMIN)
  @Get('getAssignedUsersRelatedToProject?')
  @HttpCode(HttpStatus.OK)
  getAssignedUsersToProject(@Query('id') id: string) {
    if (!Number(id)) {
      throw new HttpException('Bad ID', HttpStatus.BAD_REQUEST);
    }
    return this.projectService.getUsersAssignedToProject(Number(id));
  }
}
