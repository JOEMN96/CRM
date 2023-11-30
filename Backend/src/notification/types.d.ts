import { Notification } from '@prisma/client';
import { Payload } from 'src/auth/types';

type EventAddNewNotificatoin = {
  data: Notification;
  user: Payload;
};
