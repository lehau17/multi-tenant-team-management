import { TypeOrmBaseEntity } from "@app/shared";
import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { NotificationTemplateOrmEntity } from "./notification-template.orm-entity";

@Entity({ name: "notification_template_translations" })
export class NotificationTemplateTranslationOrmEntity extends TypeOrmBaseEntity {

  @Column({ name: 'template_id' })
  templateId: string;

  @Column({ name: 'language_code', length: 5 })
  languageCode: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  subject: string | null;

  @Column({ type: 'text' })
  body: string;

  @Column({ type: 'simple-array', nullable: true })
  variables: string[];

  @Column({ name: 'is_default', default: false })
  isDefault: boolean;

  @ManyToOne(
    () => NotificationTemplateOrmEntity,
    (template) => template.translations,
    { onDelete: 'CASCADE' }
  )
  @JoinColumn({ name: 'template_id' })
  template: NotificationTemplateOrmEntity;
}
