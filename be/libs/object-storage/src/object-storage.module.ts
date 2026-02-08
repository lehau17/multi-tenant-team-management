import { Module, Global } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UploadPortToken } from './domain/port/upload.port';
import { ObjectStorageFactory } from './infrastructure/factory/object-storage.factory';

import { S3ClientProvider } from './infrastructure/provider/s3.provider';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [
    ObjectStorageFactory,
    S3ClientProvider,
    {
      provide: UploadPortToken,
      useFactory: (factory: ObjectStorageFactory, config: ConfigService) => {
        return factory.create({
          strategy: 's3', // Hardcoded for now, or read from config
        });
      },
      inject: [ObjectStorageFactory, ConfigService],
    },
  ],
  exports: [UploadPortToken],
})
export class ObjectStorageModule { }
