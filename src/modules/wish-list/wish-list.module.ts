import { Module } from '@nestjs/common';
import { WishListController } from './wish-listcontroller';
import { WishListService } from './wish-list.service';

@Module({
  controllers: [WishListController],
  providers: [WishListService]
})
export class WishlistModule {}
