// percentage-discount.service.ts
import { Injectable } from '@nestjs/common';
import { DiscountService } from './discount.service';

@Injectable()
export class PercentageDiscountService implements DiscountService {
  calculateDiscount(originalPrice: number,discount:number): number {
    const discountAmount = (originalPrice * discount) / 100;
    return discountAmount;
  }
}
