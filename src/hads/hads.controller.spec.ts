import { Test, TestingModule } from '@nestjs/testing';
import { HadsController } from './hads.controller';
import { HadsService } from './hads.service';

describe('HadsController', () => {
  let controller: HadsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HadsController],
      providers: [HadsService],
    }).compile();

    controller = module.get<HadsController>(HadsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
