import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Project } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  IAddUserToProject,
  ICreateNewProject,
  IPossibleProjectOwners,
} from './types';

@Injectable()
export class ProjectsService {
  constructor(private dataSource: PrismaService) {}

  async getAllprojects(): Promise<Project[]> {
    return this.dataSource.project.findMany({
      distinct: ['name'],
    });
  }

  async getUsersProjectsById(id: number): Promise<Project[]> {
    return await this.dataSource.project.findMany({
      where: {
        userId: id,
      },
      distinct: ['name'],
    });
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

  async addUserToProject(dto: IAddUserToProject): Promise<Project> {
    const { projectName, userId } = dto;

    const [project, id, alreadyAdded] = await Promise.all([
      await this.dataSource.project.findFirst({
        where: {
          name: projectName,
        },
      }),
      await this.dataSource.users.findUnique({
        where: {
          id: userId,
        },
      }),
      await this.dataSource.project.findFirst({
        where: {
          userId,
        },
      }),
    ]);

    if (!id) {
      throw new HttpException('Invalid UserID', HttpStatus.BAD_REQUEST);
    }

    if (!project) {
      throw new HttpException('Invalid ProjectName', HttpStatus.BAD_REQUEST);
    }

    if (alreadyAdded) {
      throw new HttpException(
        'User is already added to the project',
        HttpStatus.BAD_REQUEST,
      );
    }

    return await this.dataSource.project.create({
      data: {
        name: projectName,
        userId,
        description: project.description,
        owner: project.owner,
      },
    });
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
}
