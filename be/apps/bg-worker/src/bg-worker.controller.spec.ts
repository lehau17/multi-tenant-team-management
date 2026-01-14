import { Test, TestingModule } from '@nestjs/testing';
import { BgWorkerController } from './bg-worker.controller';
import { BgWorkerService } from './bg-worker.service';

describe('BgWorkerController', () => {
  let bgWorkerController: BgWorkerController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [BgWorkerController],
      providers: [BgWorkerService],
    }).compile();

    bgWorkerController = app.get<BgWorkerController>(BgWorkerController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(bgWorkerController.getHello()).toBe('Hello World!');
    });
  });
});
