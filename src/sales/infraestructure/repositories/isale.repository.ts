import { EntityRepository, Repository } from "typeorm";
import { Sale } from "../entities/sale.entity";
import { ISaleRepository } from "src/sales/domain/irepositories/isale.repository";
import { CreateSaleDto } from "src/sales/application/dto/create-sale.dto";
import { Product } from "src/products/infraestructure/entities/product.entity";
import { BadRequestException, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

@EntityRepository(Sale)
export class SaleRepository extends Repository<Sale> implements ISaleRepository{
  constructor(
    @InjectRepository(Product)
    private readonly productRepository:Repository<Product>,
  ){
    super()
  }
    async createSale(createSaleDto: CreateSaleDto): Promise<string> {
        try {
          const product = await this.productRepository.findOne({productCode:createSaleDto.products[0].productCode})
          const name=(product).productName
          return name
        } catch (error) {
          throw new BadRequestException()
        }
    }

    findAll() {
        
    }

    findOneById(saleId: any) {
        
    }
}