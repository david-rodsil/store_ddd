import { EntityRepository, Repository } from "typeorm";
import { Sale } from "../entities/sale.entity";
import { ISaleRepository } from "src/sales/domain/irepositories/isale.repository";
import { CreateSaleDto } from "src/sales/application/dto/create-sale.dto";
import { Product } from "src/products/infraestructure/entities/product.entity";
import { BadRequestException, NotFoundException } from "@nestjs/common";
import { Sales_Products } from "../entities/sale_product.entity";
import { ProductRepository } from "src/products/infraestructure/repositories/iproduct.repository";
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
        const sale = new Sale();
     const products: Product[] = createSaleDto.products;
     let totalSale: number = 0;
     let totalProducts: number = 0;
     let listProducts = [];

     //Para realizar la transacción
     const queryRunner = this.manager.connection.createQueryRunner();
     await queryRunner.connect();
     await queryRunner.startTransaction();

     try {
       for (let index = 0; index < products.length; index++) {
 
         //Obtenemos el producto
         let product = await this.productRepository.findOne({productCode:products[index].productCode})

         //Si no se encuentra el producto se manda un mensaje de error
         if (!product) {
          throw new NotFoundException(`Product ${products[index].productCode} not found`)
         }
         //Calculando el total de la venta en $
         let discountProduct:number=product.productDiscount/100 * product.productPrice;
         
         totalSale = totalSale + (parseFloat(String(product.productPrice))-discountProduct) * products[index].items;         

         //Si hay producto suficiente se realiza el decremento
         if (product.productStock >= products[index].items ) {
           await queryRunner.manager.decrement(Product,{ productId: product.productId },'productStock',products[index].items,);
           totalProducts += products[index].items;
           listProducts.push(product);
         } else {
          //Si no hay productos suficientes en stock para cubrir la peticion se lanza un error
           throw new BadRequestException(`Product ${product.productCode} is not enough in stock`);
         }
       }

       //Se crea una venta
       sale.saleTotal = Number(totalSale.toFixed(2));
       sale.saleItems = totalProducts;
       const saleProduct = await queryRunner.manager.save(Sale, sale);

       //Se registra la venta en la tabla pivote
       listProducts.forEach(async (product, index) => {
         const sale_product: Sales_Products = {
           sales: saleProduct,
           products: product,
           totalProducts: products[index].items,
         };
         await queryRunner.manager.save(Sales_Products, sale_product);
       });

       //Se ejecuta la transacción
       await queryRunner.commitTransaction();
       await queryRunner.release();

     } catch (error) {
       //Si algo falla en la operación, se lanza un error y se hace un rollback
       await queryRunner.rollbackTransaction();
       await queryRunner.release();
     }

    return "Successful";
    }

    findAll() {
        
    }

    findOneById(saleId: any) {
        
    }
}