import { NestFactory } from '@nestjs/core';
import { initializeTransactionalContext, StorageDriver } from 'typeorm-transactional';
import { MainApiModule } from './main-api.module';

async function bootstrap() {
  initializeTransactionalContext({ storageDriver: StorageDriver.AUTO });
  const app = await NestFactory.create(MainApiModule);
  app.enableCors({
    origin : "*"
  })
//     app.enableVersioning({
//     defaultVersion: "1",
//     prefix : "v",
// type : VersioningType.URI
//   })
  app.setGlobalPrefix("/api/")

  await app.listen(process.env.port ?? 3000);
}
bootstrap();
