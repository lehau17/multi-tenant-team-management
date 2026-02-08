import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3Client } from '@aws-sdk/client-s3';
import { IUploadPort } from '../../domain/port/upload.port';
import { ObjectStorageOptions } from '../../domain/types/object-storage.types';
import { UploadPortAdapter } from '../adapter/port.adapter';
import { S3_CLIENT_TOKEN } from '../provider/s3.provider';

@Injectable()
export class ObjectStorageFactory {
    constructor(
        private readonly configService: ConfigService,
        @Inject(S3_CLIENT_TOKEN) private readonly s3Client: S3Client
    ) { }

    create(options: ObjectStorageOptions): IUploadPort {
        switch (options.strategy) {
            case 's3':
                return new UploadPortAdapter(this.s3Client, this.configService);
            // We could also pass options directly to adapter if we wanted to avoid strict dependency on global ConfigService inside the adapter,
            // but sticking to the current pattern where Adapter uses ConfigService.
            case 'local':
                throw new Error('Local storage strategy not implemented yet');
            default:
                throw new Error(`Unknown storage strategy: ${options.strategy}`);
        }
    }
}
