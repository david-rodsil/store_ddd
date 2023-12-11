import { Injectable } from '@nestjs/common';
import {
  CustomResponse,
  CustomResponseInterface,
} from 'src/common/customResponse/response';

import { CreateProductDto } from 'src/products/application/dto/create-product.dto';
import { IProductRepository } from '../irepositories/iproduct.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductRepository } from 'src/products/infraestructure/repositories/iproduct.repository';

@Injectable()
export class ProductService {
  private readonly res = new CustomResponse();
  constructor(
    @InjectRepository(ProductRepository)
    public readonly productRepository: IProductRepository,
  ) {}
  async create(createProductDto: CreateProductDto): Promise<CustomResponseInterface> {
    const productN = await this.productRepository.createProduct(createProductDto);
    return this.res.response('OK', 'Product was created.', productN, new Date());
  }

}
