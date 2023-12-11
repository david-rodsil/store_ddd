import { CreateProductDto } from 'src/products/application/dto/create-product.dto';
import { IProduct } from '../ientities/iproduct.entity';

export interface IProductRepository {
  createProduct(createProductDto: CreateProductDto): Promise<IProduct>;
}
