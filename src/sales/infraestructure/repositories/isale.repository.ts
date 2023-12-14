import { EntityRepository, Repository } from "typeorm";
import { Sale } from "../entities/sale.entity";
import { ISaleRepository } from "src/sales/domain/irepositories/isale.repository";
import { CreateSaleDto } from "src/sales/application/dto/create-sale.dto";
import { Product } from "src/products/infraestructure/entities/product.entity";
import { BadRequestException, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

@EntityRepository(Sale)
export class SaleRepository extends Repository<Sale> implements ISaleRepository{
    async createSale(sale: Sale): Promise<Sale> {
        const queryRunner = this.manager.connection.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
          const saleProduct = await queryRunner.manager.save(Sale, sale);
          await queryRunner.commitTransaction();
          await queryRunner.release();
          return saleProduct
        } catch (error) {
          await queryRunner.rollbackTransaction();
          await queryRunner.release();
          throw new BadRequestException()
        }
    }

    findAll() {
        
    }

    findOneById(saleId: any) {
        
    }
}