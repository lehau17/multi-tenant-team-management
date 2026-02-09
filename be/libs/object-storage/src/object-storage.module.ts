import { Module, Global } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
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
      useFactory: (factory: ObjectStorageFactory) => {
        return factory.create({
          strategy: 's3'
        });
      },
      inject: [ObjectStorageFactory],
    },
  ],
  exports: [UploadPortToken],
})
export class ObjectStorageModule { }
