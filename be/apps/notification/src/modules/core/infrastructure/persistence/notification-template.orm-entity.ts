import { TypeOrmBaseEntity } from "@app/shared";
import { Column, Entity, OneToMany } from "typeorm";
import { NotificationTemplateTranslationOrmEntity } from "./notification-template-translation.orm-entity";

@Entity({ name: "notification_templates" })
export class NotificationTemplateOrmEntity extends TypeOrmBaseEntity {

  @Column({ unique: true })
  code: string;

  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({ type: 'varchar', length: 20 })
  channel: string;

  @Column({ default: true })
  isActive: boolean;

  @OneToMany(
    () => NotificationTemplateTranslationOrmEntity,
    (translation) => translation.template,
    { cascade: true, eager: true }
  )
  translations: NotificationTemplateTranslationOrmEntity[];
}
