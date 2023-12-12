import { Module } from '@nestjs/common';
import { SalesService } from './domain/services/sales.service';
import { SalesController } from './application/controller/sales.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Sale } from './infraestructure/entities/sale.entity';
import { Product } from 'src/products/infraestructure/entities/product.entity';
import { Sales_Products } from './infraestructure/entities/sale_product.entity';
import { ProductsModule } from 'src/products/products.module';
import { SaleRepository } from './infraestructure/repositories/isale.repository';

@Module({
  controllers: [SalesController],
  providers: [SalesService],
  imports: [
    //Es necesario importar la entidad en el modulo para poder vincular la tabla de la base de datos con el modulo
    TypeOrmModule.forFeature([
      Sale,
      Product,
      Sales_Products,
      SaleRepository,   
    ]),
    ProductsModule
  ]
})
export class SalesModule {}
