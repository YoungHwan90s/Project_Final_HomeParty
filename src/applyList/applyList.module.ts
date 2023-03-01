import { Module } from '@nestjs/common';
import { ApplylistController } from './applyList.controller';
import { ApplylistService } from './applyList.service';

@Module({
  controllers: [ApplylistController],
  providers: [ApplylistService]
})
export class ApplylistModule {}
