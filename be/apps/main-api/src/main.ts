import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { initializeTransactionalContext, StorageDriver } from 'typeorm-transactional';
import { join } from 'path';
import { MainApiModule } from './main-api.module';

async function bootstrap() {
  initializeTransactionalContext({ storageDriver: StorageDriver.AUTO });
  const app = await NestFactory.create(MainApiModule);

  // gRPC microservice
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      package: 'identity',
      protoPath: join(__dirname, '../../../proto/identity.proto'),
      url: '0.0.0.0:5000',
    },
  });

  app.enableCors({
    origin: '*',
  });
  app.setGlobalPrefix('/api/');

  await app.startAllMicroservices();
  await app.listen(process.env.port ?? 3000);
}
bootstrap();
