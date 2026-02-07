import { NotificationTemplate, NotificationChannel } from "../entity/notification-template.entity";

export const NOTIFICATION_TEMPLATE_REPOSITORY_PORT = Symbol('NOTIFICATION_TEMPLATE_REPOSITORY_PORT');

export interface INotificationTemplateRepositoryPort {
  save(template: NotificationTemplate): Promise<void>;
  findById(id: string): Promise<NotificationTemplate | null>;
  findByCode(code: string): Promise<NotificationTemplate | null>;
  findByChannel(channel: NotificationChannel): Promise<NotificationTemplate[]>;
  findAll(): Promise<NotificationTemplate[]>;
  findActive(): Promise<NotificationTemplate[]>;
  delete(id: string): Promise<void>;
  exists(code: string): Promise<boolean>;
}
