import { CreateProductDto } from 'src/products/application/dto/create-product.dto';
import { IProduct } from '../ientities/iproduct.entity';
import { FindProductDto } from '../../application/dto/find-product.dto';
import { UpdateProductDto } from '../../application/dto/update-product.dto';
import { QueryRunner } from 'typeorm';

export interface IProductRepository {
  createProduct(createProductDto: CreateProductDto): Promise<IProduct>;
  findAll(findProductDto:FindProductDto):Promise<IProduct[]>;
  findOneByCode(productId:string):Promise<IProduct>
  findById(term:String):Promise<IProduct[]>;
  updateProduct(productId:String,updateProductDto:UpdateProductDto):Promise<IProduct>
  removeProduct(productId:String):Promise<String>
  createQueryRunner():Promise<QueryRunner>
}
