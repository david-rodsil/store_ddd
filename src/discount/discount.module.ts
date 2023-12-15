import { Module } from '@nestjs/common';
import { PercentageDiscountService } from './percentage-discount.service';
import { CurrencyDiscountService } from './currency-discount.service';

@Module({
  providers: [PercentageDiscountService,CurrencyDiscountService],
  exports:[PercentageDiscountService,CurrencyDiscountService]
})
export class DiscountModule {}
