import { Module } from '@nestjs/common';
import { SalesService } from './domain/services/sales.service';
import { SalesController } from './application/controller/sales.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Sale } from './infraestructure/entities/sale.entity';
import { Product } from 'src/products/infraestructure/entities/product.entity';
import { Sale_Products } from './infraestructure/entities/sale_products.entity';
import { ProductsModule } from 'src/products/products.module';
import { SaleRepository } from './infraestructure/repositories/sale.repository';
import { ProductRepository } from 'src/products/infraestructure/repositories/product.repository';
import { Sale_ProductsRepository } from './infraestructure/repositories/sale_products.repository';
import { CurrencyDiscountService } from 'src/discount/currency-discount.service';
import { PercentageDiscountService } from 'src/discount/percentage-discount.service';

@Module({
  controllers: [SalesController],
  providers: [SalesService,CurrencyDiscountService,PercentageDiscountService],
  imports: [
    //Es necesario importar la entidad en el modulo para poder vincular la tabla de la base de datos con el modulo
    TypeOrmModule.forFeature([
      Sale,
      Product,
      Sale_Products,
      SaleRepository,
      ProductRepository,
      Sale_ProductsRepository   
    ]),
    ProductsModule
  ]
})
export class SalesModule {}
