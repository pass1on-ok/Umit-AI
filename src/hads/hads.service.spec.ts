import { Test, TestingModule } from '@nestjs/testing';
import { HadsService } from './hads.service';

describe('HadsService', () => {
  let service: HadsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HadsService],
    }).compile();

    service = module.get<HadsService>(HadsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
