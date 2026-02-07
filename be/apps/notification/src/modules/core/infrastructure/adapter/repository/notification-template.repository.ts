import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { V7Generator } from 'uuidv7';
import {
  NotificationTemplate,
  NotificationChannel,
} from '../../../domain/entity/notification-template.entity';
import { NotificationTemplateTranslation } from '../../../domain/entity/notification-template-translation.entity';
import { INotificationTemplateRepositoryPort } from '../../../domain/port/notification-template.repository.port';
import { TemplateCode } from '../../../domain/value-object/template-code.value-object';
import { LanguageCode } from '../../../domain/value-object/language-code.value-object';
import { TemplateContent } from '../../../domain/value-object/template-content.value-object';
import { NotificationTemplateOrmEntity } from '../../persistence/notification-template.orm-entity';
import { NotificationTemplateTranslationOrmEntity } from '../../persistence/notification-template-translation.orm-entity';

@Injectable()
export class NotificationTemplateRepository implements INotificationTemplateRepositoryPort {
  private readonly uuidGenerator = new V7Generator();

  constructor(
    @InjectRepository(NotificationTemplateOrmEntity)
    private readonly templateRepo: Repository<NotificationTemplateOrmEntity>,
  ) {}

  async save(template: NotificationTemplate): Promise<void> {
    const ormEntity = this.toOrmEntity(template);
    await this.templateRepo.save(ormEntity);
  }

  async findById(id: string): Promise<NotificationTemplate | null> {
    const ormEntity = await this.templateRepo.findOne({
      where: { id },
      relations: ['translations'],
    });

    if (!ormEntity) return null;
    return this.toDomainEntity(ormEntity);
  }

  async findByCode(code: string): Promise<NotificationTemplate | null> {
    const ormEntity = await this.templateRepo.findOne({
      where: { code },
      relations: ['translations'],
    });

    if (!ormEntity) return null;
    return this.toDomainEntity(ormEntity);
  }

  async findByChannel(channel: NotificationChannel): Promise<NotificationTemplate[]> {
    const ormEntities = await this.templateRepo.find({
      where: { channel },
      relations: ['translations'],
    });

    return ormEntities.map(entity => this.toDomainEntity(entity));
  }

  async findAll(): Promise<NotificationTemplate[]> {
    const ormEntities = await this.templateRepo.find({
      relations: ['translations'],
    });

    return ormEntities.map(entity => this.toDomainEntity(entity));
  }

  async findActive(): Promise<NotificationTemplate[]> {
    const ormEntities = await this.templateRepo.find({
      where: { isActive: true },
      relations: ['translations'],
    });

    return ormEntities.map(entity => this.toDomainEntity(entity));
  }

  async delete(id: string): Promise<void> {
    await this.templateRepo.delete(id);
  }

  async exists(code: string): Promise<boolean> {
    const count = await this.templateRepo.count({ where: { code } });
    return count > 0;
  }

  private generateId(): string {
    return this.uuidGenerator.generate().toString();
  }

  private toOrmEntity(domain: NotificationTemplate): NotificationTemplateOrmEntity {
    const orm = new NotificationTemplateOrmEntity();
    orm.id = domain.id || this.generateId();
    orm.code = domain.code.value;
    orm.name = domain.name;
    orm.description = domain.description || null;
    orm.channel = domain.channel;
    orm.isActive = domain.isActive;
    orm.translations = domain.translations.map(t => this.translationToOrmEntity(t, orm.id));
    return orm;
  }

  private translationToOrmEntity(
    domain: NotificationTemplateTranslation,
    templateId: string,
  ): NotificationTemplateTranslationOrmEntity {
    const orm = new NotificationTemplateTranslationOrmEntity();
    orm.id = domain.id || this.generateId();
    orm.templateId = templateId;
    orm.languageCode = domain.languageCode.value;
    orm.subject = domain.content.subject || null;
    orm.body = domain.content.body;
    orm.variables = domain.content.variables;
    orm.isDefault = domain.isDefault;
    return orm;
  }

  private toDomainEntity(orm: NotificationTemplateOrmEntity): NotificationTemplate {
    const translations = orm.translations?.map(t => this.translationToDomainEntity(t)) || [];

    return NotificationTemplate.reconstitute(
      {
        code: TemplateCode.create(orm.code),
        name: orm.name,
        description: orm.description || undefined,
        channel: orm.channel as NotificationChannel,
        isActive: orm.isActive,
        translations,
      },
      orm.id,
    );
  }

  private translationToDomainEntity(
    orm: NotificationTemplateTranslationOrmEntity,
  ): NotificationTemplateTranslation {
    return NotificationTemplateTranslation.reconstitute(
      {
        templateId: orm.templateId,
        languageCode: LanguageCode.create(orm.languageCode),
        content: TemplateContent.create(orm.body, orm.subject || undefined),
        isDefault: orm.isDefault,
      },
      orm.id,
    );
  }
}
