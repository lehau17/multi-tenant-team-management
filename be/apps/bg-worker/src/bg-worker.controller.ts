import { Controller, Get } from '@nestjs/common';
import { BgWorkerService } from './bg-worker.service';

@Controller()
export class BgWorkerController {
  constructor(private readonly bgWorkerService: BgWorkerService) {}

  @Get()
  getHello(): string {
    return this.bgWorkerService.getHello();
  }
}
