import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { NotificationTypes } from '@prisma/client';
// import { EventEmitter2 } from '@nestjs/event-emitter';
import { Payload } from 'src/auth/types';

@Injectable()
export class NotificationService {
  constructor(
    private dataSource: PrismaService, // private eventEmitter: EventEmitter2,
  ) {}

  async pushNotifcation(
    message: string,
    user: Payload,
    type: NotificationTypes = NotificationTypes.INFO,
  ) {
    try {
      let notification = await this.dataSource.notification.create({
        data: {
          message,
          userId: user.id,
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
      return notification;
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
