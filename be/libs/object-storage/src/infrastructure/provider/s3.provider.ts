import { Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3Client } from '@aws-sdk/client-s3';

export const S3_CLIENT_TOKEN = 'S3_CLIENT';

export const S3ClientProvider: Provider = {
    provide: S3_CLIENT_TOKEN,
    useFactory: (configService: ConfigService) => {
        return new S3Client({
            region: configService.get<string>('AWS_REGION'),
            credentials: {
                accessKeyId: configService.get<string>('AWS_ACCESS_KEY_ID'),
                secretAccessKey: configService.get<string>('AWS_SECRET_ACCESS_KEY'),
            },
            forcePathStyle: configService.get<boolean>('AWS_FORCE_PATH_STYLE'),
            endpoint: configService.get<string>('AWS_ENDPOINT'),
        });
    },
    inject: [ConfigService],
};
