import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { NotificationTypes } from '@prisma/client';

@Injectable()
export class NotificationService {
  constructor(private dataSource: PrismaService) {}

  async addNotification(
    id: number,
    message: string,
    type: NotificationTypes = NotificationTypes.INFO,
  ) {
    try {
      return await this.dataSource.users.update({
        where: {
          id,
        },
        data: {
          notifications: { create: { message, type } },
        },
      });
    } catch (e) {
      return null;
    }
  }

  async getUserNotification(id: number) {
    return await this.dataSource.users
      .findUnique({
        where: { id },
      })
      .notifications();
  }
}
