import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { CreateNewUser } from './dto';

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
      select: { email: true, name: true, role: true, active: true, id: true },
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

  async hashPassword(pw: string) {
    return await bcrypt.hash(pw, 10);
  }
}
