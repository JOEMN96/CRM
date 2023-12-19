interface INotification {
  id: number;
  message: string;
  type: NotificationTypes;
  createdAt: string;
  userId: number;
}

enum NotificationTypes {
  INFO,
  WARN,
  ENTRY,
}
