import { Test, TestingModule } from '@nestjs/testing';
import { ApplylistService } from './applyList.service';

describe('ApplylistService', () => {
  let service: ApplylistService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ApplylistService],
    }).compile();

    service = module.get<ApplylistService>(ApplylistService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
