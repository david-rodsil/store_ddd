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

    async findAll() {
      const sales=await this.find()
      const salesDetails: any[]=[];
      sales.forEach((sale)=>{
        //Creamos un objeto con los valores que se devolveran en la busqueda
        const detailSale={
          saleId:sale.saleId,
          dateTime:sale.saleTime,
          totalSale:parseFloat(String(sale.saleTotal)),
          totalItems:parseInt(String(sale.saleItems))
        }
        salesDetails.push(detailSale)
      })
      return salesDetails;
    }

    findOneById(saleId: any) {
        
    }
}