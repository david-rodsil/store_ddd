import { CreateProductDto } from 'src/products/application/dto/create-product.dto';
import { IProduct } from '../ientities/iproduct.entity';
import { FindProductDto } from '../../application/dto/find-product.dto';

export interface IProductRepository {
  createProduct(createProductDto: CreateProductDto): Promise<IProduct>;
  findAll(findProductDto:FindProductDto):Promise<IProduct[]>
}
