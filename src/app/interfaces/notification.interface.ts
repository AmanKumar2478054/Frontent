export interface NotificationItem {
  notificationId: number;
  userId: number;
  entityId: number;
  entityType: string;
  message: string;
  category: string;
  status: string;
  createdDate: string;
}
