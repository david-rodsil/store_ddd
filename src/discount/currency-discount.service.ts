// currency-discount.service.ts
import { Injectable } from '@nestjs/common';
import { DiscountService } from './discount.service';

@Injectable()
export class CurrencyDiscountService implements DiscountService {

  calculateDiscount(originalPrice: number,discount:number): number {
    return discount;
  }
}
