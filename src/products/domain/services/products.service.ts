import { Injectable } from '@nestjs/common';
import {
  CustomResponse,
  CustomResponseInterface,
} from 'src/common/customResponse/response';

import { CreateProductDto } from 'src/products/application/dto/create-product.dto';
import { IProductRepository } from '../irepositories/iproduct.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductRepository } from 'src/products/infraestructure/repositories/product.repository';
import { FindProductDto } from '../../application/dto/find-product.dto';
import { UpdateProductDto } from 'src/products/application/dto/update-product.dto';

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

  async findAll(findProductDto:FindProductDto): Promise<CustomResponseInterface>{
    const products = await this.productRepository.findAll(findProductDto);
    return this.res.response('OK', 'Products was found.', products, new Date());
  }

  async findOneById(term:String): Promise<CustomResponseInterface>{
    const product = await this.productRepository.findOneById(term);
    return this.res.response('OK', 'Product was found.', product, new Date());
  }

  async update(productId:String,updateProductDto:UpdateProductDto): Promise<CustomResponseInterface>{
    const product=await this.productRepository.updateProduct(productId,updateProductDto);
    return this.res.response('OK', 'Product was update.', product, new Date());
  }

  async remove(productId:String): Promise<CustomResponseInterface>{
    const message=await this.productRepository.removeProduct(productId)
    return this.res.response('OK','Product was delete',message, new Date())
  }

}
