import { Injectable } from "@nestjs/common";
import { IUploadPort } from "../../domain/port/upload.port";
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { ConfigService } from "@nestjs/config";
@Injectable()
export class UploadPortAdapter implements IUploadPort {
    constructor(
        private readonly s3Client: S3Client,
        private readonly configService: ConfigService
    ) { }
    async upload(file: Express.Multer.File, folder: string = 'default'): Promise<string> {
        const uniqueKey = `${Date.now()}-${Math.round(Math.random() * 1E9)}-${file.originalname}`;
        const key = `${folder}/${uniqueKey}`;

        const command = new PutObjectCommand({
            Bucket: this.configService.get<string>('AWS_BUCKET'),
            Key: key,
            Body: file.buffer,
            ContentType: file.mimetype,
        });
        await this.s3Client.send(command);
        return key;
    }
}