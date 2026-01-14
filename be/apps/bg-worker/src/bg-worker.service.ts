import { Injectable } from '@nestjs/common';

@Injectable()
export class BgWorkerService {
  getHello(): string {
    return 'Hello World!';
  }
}
