import { Controller, Get } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { Role, Roles } from 'src/auth/common';
import { User } from 'src/utils';
import { Payload } from 'src/auth/types';

@Roles(Role.ADMIN, Role.SUPERADMIN)
@Controller('notification')
export class NotificationController {
  constructor(private notificatonService: NotificationService) {}

  @Get('')
  getAllNotifications(@User() user: Payload) {
    this.notificatonService.getUserNotification(user.id);
  }
}
