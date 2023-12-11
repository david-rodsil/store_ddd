import { EntityRepository, Repository, getRepository } from 'typeorm';
import { Product } from '../entities/product.entity';
import { IProductRepository } from 'src/products/domain/irepositories/iproduct.repository';
import { IProduct } from 'src/products/domain/ientities/iproduct.entity';
import { CreateProductDto } from 'src/products/application/dto/create-product.dto';
import { error } from 'console';
import { FindProductDto } from 'src/products/application/dto/find-product.dto';

@EntityRepository(Product)
export class ProductRepository extends Repository<Product> implements IProductRepository {
  async createProduct(createProductDto): Promise<IProduct> {
    return await this.save(createProductDto);
  }
  async findAll(findProductDto: FindProductDto): Promise<IProduct[]> {
    const{sort="", by="" ,limit=50, offset=0 ,min=0,max=0} = findProductDto;

    let query =this.createQueryBuilder('tblProducts');

    //Paginacion
    query= query.skip(offset).take(limit)

    //Ordenar por nombre y precio
    if (sort=="name" && by=="asc")query.orderBy({['"Product_strName"']:'ASC'})
    if (sort=="name" && by=="desc")query.orderBy({['"Product_strName"']:'DESC'})
    if (sort=="price" && by=="asc")query.orderBy({['"Product_numPrice"']:'ASC'})
    if (sort=="price" && by=="desc")query.orderBy({['"Product_numPrice"']:'DESC'})
    
    //Buscar por rango de precio
    if (min!=0 && max!=0 && max>0 && min >0 && max>min) {
      query=query.andWhere('"Product_numPrice" <= :max',{max})
      query=query.andWhere('"Product_numPrice" >= :min',{min}) 
    }
      return await query.getMany();
  }
}
