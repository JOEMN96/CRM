import { HttpException, HttpStatus, Injectable, StreamableFile } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { CreateNewUser } from './dto';
import { createReadStream, existsSync, unlinkSync } from 'fs';
import { join } from 'path';
import { Response } from 'express';

@Injectable()
export class UsersService {
  constructor(private dataSource: PrismaService) {}

  async getAllUsers() {
    let users = await this.dataSource.users.findMany({
      select: {
        email: true,
        name: true,
        role: true,
        active: true,
        id: true,
        profile: {
          select: {
            profilePicFilePath: true,
          },
        },
      },
    });
    if (users.length) {
      return users;
    } else {
      throw new HttpException('Users Not Found', HttpStatus.BAD_REQUEST);
    }
  }

  async getUserById(id: number) {
    let user = await this.dataSource.users.findFirst({
      where: {
        id,
      },
      select: {
        email: true,
        name: true,
        role: true,
        active: true,
        id: true,
        profile: {
          select: {
            profilePicFilePath: true,
          },
        },
      },
    });

    if (user?.id) {
      return user;
    } else {
      throw new HttpException('User Not Found', HttpStatus.BAD_REQUEST);
    }
  }

  async deleteUserById(id: number) {
    try {
      return await this.dataSource.users.delete({
        where: {
          id,
        },
        select: { email: true, name: true, role: true, active: true, id: true },
      });
    } catch (error) {
      throw new HttpException('User Not Found', HttpStatus.BAD_REQUEST);
    }
  }

  async createNewUser({ email, password, name, role }: CreateNewUser) {
    let emailAlreadyTaken = await this.dataSource.users.findUnique({
      where: {
        email,
      },
    });

    if (emailAlreadyTaken) {
      throw new HttpException('User already exits', HttpStatus.CONFLICT);
    }

    const tempPassword = await this.hashPassword(password);
    return await this.dataSource.users.create({
      data: {
        name,
        email,
        hashedPassWord: tempPassword,
        role,
      },
      select: { email: true, name: true, role: true, active: true, id: true },
    });
  }

  async getUsersDocs(id: number) {
    return await this.dataSource.users
      .findUnique({
        where: { id },
      })
      .documents();
  }

  async getFile(filePath: string, res: Response, id: number): Promise<StreamableFile> {
    let documents = await this.dataSource.users
      .findUnique({
        where: {
          id,
        },
      })
      .documents();

    if (documents.length < 1 || !existsSync(join(process.cwd(), filePath))) {
      throw new HttpException('File not found', HttpStatus.NOT_FOUND);
    }

    let requestedDoc = documents.find((doc) => doc.path === filePath);

    if (!requestedDoc) {
      throw new HttpException('You don"t have access to view this file', HttpStatus.FORBIDDEN);
    }

    res.set({
      'Content-Type': requestedDoc.type,
    });
    const file = createReadStream(join(process.cwd(), filePath));

    return new StreamableFile(file);
  }

  async deleteUserDoc(filePath: string, id: number) {
    let documents = await this.dataSource.users
      .findUnique({
        where: {
          id,
        },
      })
      .documents();

    if ((documents && documents.length < 1) || !existsSync(join(process.cwd(), filePath))) {
      throw new HttpException('File not found', HttpStatus.NOT_FOUND);
    }

    let requestedDoc = documents.find((doc) => doc.path === filePath);

    await this.dataSource.documents.delete({
      where: {
        id: requestedDoc.id,
        userId: id,
      },
    });
    unlinkSync(join(process.cwd(), filePath));
  }

  //  utility Methods
  async hashPassword(pw: string) {
    return await bcrypt.hash(pw, 10);
  }
}
