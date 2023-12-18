import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { NotificationTypes } from '@prisma/client';
// import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class NotificationService {
  constructor(
    private dataSource: PrismaService, // private eventEmitter: EventEmitter2,
  ) {}

  async sendNotificationToUser(message: string, userId: number, type: NotificationTypes = NotificationTypes.INFO) {
    await this.dataSource.notification.create({
      data: {
        message,
        userId: userId,
      },
      select: {
        message: true,
        id: true,
      },
    });

    // this.eventEmitter.emit('notification.sent', {
    //   data: [notification],
    //   user,
    // });
  }

  async sendTimeEntryNotifcationToProjectOwner(projID: number, userId: number, date: string) {
    let [project, user] = await Promise.all([
      await this.dataSource.project.findUnique({ where: { id: projID } }),
      await this.dataSource.users.findUnique({ where: { id: userId } }),
    ]);

    const MESSAGE = `${user.name} added new Entry dated: ${date}`;
    this.sendNotificationToUser(MESSAGE, project.userId);
  }

  async sendProjetRelatedNotificationToSuperAdmin(msg: string, userId: number) {
    let [superAdmin, user] = await Promise.all([
      await this.dataSource.users.findFirst({ where: { role: 'SUPERADMIN' } }),
      await this.dataSource.users.findFirst({ where: { id: userId } }),
    ]);

    const MESSAGE = `${user.name} ${msg}`;
    this.sendNotificationToUser(MESSAGE, superAdmin.id);
  }

  async getUserNotification(id: number) {
    return await this.dataSource.users
      .findUnique({
        where: { id },
      })
      .notifications();
  }
}
