import { NestFactory } from '@nestjs/core';
import { MainApiModule } from './main-api.module';

async function bootstrap() {
  const app = await NestFactory.create(MainApiModule);
  app.enableCors({
    origin : "*"
  })
  app.setGlobalPrefix("/api/")
  await app.listen(process.env.port ?? 3000);
}
bootstrap();
