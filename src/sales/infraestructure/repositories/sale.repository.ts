import { EntityRepository, Repository } from "typeorm";
import { Sale } from "../entities/sale.entity";
import { ISaleRepository } from "src/sales/domain/irepositories/isale.repository";
import { InternalServerErrorException } from "@nestjs/common";

@EntityRepository(Sale)
export class SaleRepository extends Repository<Sale> implements ISaleRepository{
  async createSale(sale:Sale):Promise<Sale>{
    //Inicia la transaccion
    const queryRunner = this.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
        const saleProduct = await queryRunner.manager.save(Sale, sale);
        await queryRunner.commitTransaction();
        await queryRunner.release();
        return saleProduct;
    } catch (error) {
        await queryRunner.rollbackTransaction();
        await queryRunner.release();
        throw new InternalServerErrorException
    }
  }

  async findAll():Promise<Sale[]> {
      const sales=await this.find()
      const salesDetails: Sale[]=[];
      sales.forEach((sale)=>{
          //Creamos un objeto con los valores que se devolveran en la busqueda
          const detailSale:Sale={
          saleId:sale.saleId,
          saleTime:sale.saleTime,
          saleTotal:parseFloat(String(sale.saleTotal)),
          saleItems:parseInt(String(sale.saleItems)),
          saleDiscount:sale.saleDiscount,
          sale_products:[]
          }
      salesDetails.push(detailSale)
      })

      return salesDetails;
  }

  findById(sale_products:any,sale:Sale) {
      //console.log(sale_products);
    const saleDetail={
      saleId:sale.saleId,
      saleTotal:parseFloat(String(sale.saleTotal)).toFixed(2),
      saleItems:parseInt(String(sale.saleItems)),
      saleTime:sale.saleTime,
      saleDisccount:parseFloat(String(sale.saleDiscount)).toFixed(2)
    }
    const saleProductsDetails:any[]=[]
    sale_products.forEach((product)=>{
      const products = {
        totalItems:parseInt(String(product.totalProducts)),
        name:product.products.productName,
        description:product.products.productDescription,
        code:product.products.productCode,
        price:parseFloat(String(product.products.productPrice)).toFixed(2),
        cost:parseFloat(String(product.products.productCost)).toFixed(2),
        salePrice:parseFloat(String(product.products.productPrice-(product.products.productDiscount/100*product.products.productPrice))).toFixed(2),
        discount:parseInt(String(product.products.productDiscount)),
        utiity:parseFloat(String(product.products.productPrice-product.products.productCost)).toFixed(2)
      }
      saleProductsDetails.push(products)
    })
    const saleDetails={saleDetail,saleProductsDetails}
    return saleDetails
  }

  async findOneSale(saleId:string,relation:string):Promise<Sale>{
    const sale= await this.findOne(saleId,{relations:[relation]})
    return sale
  }
}