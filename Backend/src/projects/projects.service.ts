import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Project } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { ICreateNewProject, IPossibleProjectOwners } from './types';
import { AddUserToProject } from './dto';

@Injectable()
export class ProjectsService {
  constructor(private dataSource: PrismaService) {}

  async getAllprojects(): Promise<Project[]> {
    return this.dataSource.project.findMany({
      distinct: ['name'],
    });
  }

  async getUsersProjects(userId: number) {
    return await this.dataSource.users
      .findUnique({
        where: { id: userId },
        select: {
          projects: true,
        },
      })
      .projects();
  }

  async createNewProject(
    newProject: ICreateNewProject,
    id: number,
  ): Promise<Project> {
    const { name, description, owner } = newProject;

    let projectExits = await this.dataSource.project.findFirst({
      where: { name },
    });

    if (projectExits) {
      throw new HttpException(
        'Project name is taken',
        HttpStatus.PRECONDITION_FAILED,
      );
    }

    return await this.dataSource.project.create({
      data: { name, description, owner, userId: id },
    });
  }

  async deleteProjectByName(name: string): Promise<HttpException> {
    let project = await this.dataSource.project.findMany({
      where: {
        name,
      },
    });

    if (!project.length) {
      throw new HttpException(
        'No projects found to delete',
        HttpStatus.NOT_FOUND,
      );
    }

    await this.dataSource.project.deleteMany({
      where: {
        name,
      },
    });
    throw new HttpException('Project deleted', HttpStatus.OK);
  }

  async addUsersToProject(dto: AddUserToProject): Promise<Project> {
    const { projectId, userIds } = dto;

    const [project, alreadyAdded] = await Promise.all([
      await this.dataSource.project.findFirst({
        where: {
          id: projectId,
        },
      }),
      await this.dataSource.project.findMany({
        where: {
          userId: { in: userIds },
          id: projectId,
        },
      }),
    ]);

    if (!project) {
      throw new HttpException('Invalid project ID', HttpStatus.BAD_REQUEST);
    }

    if (alreadyAdded.length) {
      throw new HttpException(
        'Some users are already added to the project',
        HttpStatus.BAD_REQUEST,
      );
    }
    let ids: { id: number }[] = userIds.map((id) => ({ id: id }));

    try {
      let res = await this.dataSource.project.update({
        where: {
          id: projectId,
        },
        data: {
          peoples: { connect: ids },
        },
      });
      return res;
    } catch (error) {
      throw new HttpException(
        'Unable to add user to project',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getPossibleProjectOwners(): Promise<IPossibleProjectOwners[] | []> {
    return await this.dataSource.users.findMany({
      where: {
        role: { in: ['ADMIN', 'SUPERADMIN'] },
        active: true,
      },
      select: {
        name: true,
        role: true,
      },
    });
  }

  async getAssignedUsersForProject() {
    // Implementation required
    return false;
  }
}
