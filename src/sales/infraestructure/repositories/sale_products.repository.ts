import { ISale_ProductsRepository } from "src/sales/domain/irepositories/isale_products.repository";
import { Sale_Products } from '../entities/sale_products.entity';
import { EntityRepository, Repository } from "typeorm";

@EntityRepository(Sale_Products)
export class Sale_ProductsRepository extends Repository<Sale_Products> implements ISale_ProductsRepository{
    async findOneSaleProducts(saleProductId:string,relation:string){
        const saleProducts=await this.findOne(saleProductId,{relations:[relation]})
        return saleProducts
    }
}