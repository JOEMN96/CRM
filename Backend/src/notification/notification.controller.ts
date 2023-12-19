import { Controller, Get } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { User } from 'src/utils';
import { Payload } from 'src/auth/types';

@Controller('notification')
export class NotificationController {
  constructor(private notificatonService: NotificationService) {}

  @Get('')
  getAllNotifications(@User() user: Payload) {
    return this.notificatonService.getUserNotification(user.id);
  }
}
