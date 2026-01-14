import { Module } from '@nestjs/common';
import { BgWorkerController } from './bg-worker.controller';
import { BgWorkerService } from './bg-worker.service';

@Module({
  imports: [],
  controllers: [BgWorkerController],
  providers: [BgWorkerService],
})
export class BgWorkerModule {}
