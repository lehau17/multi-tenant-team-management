import { NestFactory } from '@nestjs/core';
import { BgWorkerModule } from './bg-worker.module';

async function bootstrap() {
  const app = await NestFactory.create(BgWorkerModule);
  await app.listen(process.env.port ?? 3000);
}
bootstrap();
