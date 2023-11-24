import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Project } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { ICreateNewProject, IPossibleProjectOwners } from './types';
import { AddUserToProject, getAssignedUsers } from './dto';

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
    const { projectId, addedusers } = dto;

    const [project] = await Promise.all([
      await this.dataSource.project.findFirst({
        where: {
          id: projectId,
        },
      }),
    ]);

    if (!project) {
      throw new HttpException('Invalid project ID', HttpStatus.BAD_REQUEST);
    }

    let addedIds: { id: number }[] = addedusers.map((id) => ({ id: id }));

    try {
      let res = await this.dataSource.project.update({
        where: {
          id: projectId,
        },
        data: {
          peoples: { set: [], connect: addedIds },
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

  async getAssignedUsersForProject(id: number) {
    // Implementation required

    let AlreadyAddedUsers = await this.getUsersAssociatedwithProject(id);

    let AllUsers = await this.dataSource.users.findMany({
      select: {
        email: true,
        name: true,
        role: true,
        active: true,
        id: true,
      },
    });

    //  Adding selected field to show differentiate users that are added to this project
    return AllUsers.map((user) => {
      if (AlreadyAddedUsers.includes(user.id)) {
        (user as any).selected = true;
      } else {
        (user as any).selected = false;
      }
      return user;
    });
  }

  // helpers
  async getUsersAssociatedwithProject(id: number): Promise<number[]> {
    const result = await this.dataSource.project.findUnique({
      where: {
        id,
      },
      select: {
        peoples: {
          select: {
            id: true,
          },
        },
      },
    });

    if (result && result.peoples) {
      return result.peoples.map((item) => item.id);
    }
    return [];
  }
}
