import { Module } from '@nestjs/common';
import { ProductService } from './domain/services/products.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductController } from './application/controller/products.controller';
import { ProductRepository } from './infraestructure/repositories/product.repository';
import { Product } from './infraestructure/entities/product.entity';

@Module({
  controllers: [ProductController],
  providers: [ProductService, ProductRepository],
  imports: [TypeOrmModule.forFeature([Product, ProductRepository])],
  exports: [TypeOrmModule],
})
export class ProductsModule {}
