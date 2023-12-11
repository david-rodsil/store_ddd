import { EntityRepository, Repository, getRepository } from 'typeorm';
import { Product } from '../entities/product.entity';
import { IProductRepository } from 'src/products/domain/irepositories/iproduct.repository';
import { IProduct } from 'src/products/domain/ientities/iproduct.entity';
import { CreateProductDto } from 'src/products/application/dto/create-product.dto';
import { error } from 'console';

@EntityRepository(Product)
export class ProductRepository extends Repository<Product> implements IProductRepository {
  async createProduct(createProductDto): Promise<IProduct> {
    return await this.save(createProductDto);
  }
}
