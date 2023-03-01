import { Test, TestingModule } from '@nestjs/testing';
import { ApplylistController } from './applyList.controller';

describe('ApplylistController', () => {
  let controller: ApplylistController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ApplylistController],
    }).compile();

    controller = module.get<ApplylistController>(ApplylistController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
