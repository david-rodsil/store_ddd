import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateSaleDto } from '../../application/dto/create-sale.dto';
import { UpdateSaleDto } from '../../application/dto/update-sale.dto';
import { CustomResponse, CustomResponseInterface } from 'src/common/customResponse/response';
import { InjectRepository } from '@nestjs/typeorm';
import { SaleRepository } from 'src/sales/infraestructure/repositories/sale.repository';
import { ISaleRepository } from '../irepositories/isale.repository';
import { ProductRepository } from 'src/products/infraestructure/repositories/product.repository';
import { Product } from 'src/products/infraestructure/entities/product.entity';
import { Sale } from 'src/sales/infraestructure/entities/sale.entity';
import { Sales_Products } from 'src/sales/infraestructure/entities/sale_product.entity';
import { Code, Repository } from 'typeorm';

@Injectable()
export class SalesService {
  
  private readonly res = new CustomResponse();

  constructor(
    @InjectRepository(Sale)
    public readonly saleRepository:Repository<Sale>,
    @InjectRepository(SaleRepository)
    public readonly salesRepository: ISaleRepository,
    @InjectRepository(ProductRepository)
    public readonly productRepository:ProductRepository,
    @InjectRepository(Sales_Products)
    public readonly saleProductRepository:Repository<Sales_Products>
  ) {}

  async create(createSaleDto: CreateSaleDto): Promise<string> {
    const products: Product[] = createSaleDto.products;
    const sale = new Sale();
    let totalSale: number = 0;
    let totalProducts: number = 0;
    let listProducts = [];
    const queryRunner = this.productRepository.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      for (let index = 0; index < products.length; index++) {
 
        //Obtenemos el producto
        let product = await this.productRepository.findOne({where:{productCode:products[index].productCode}})

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
      const saleProduct = await this.salesRepository.createSale(sale);

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
      return 'success'
    } catch (error) {
      await queryRunner.rollbackTransaction();
      await queryRunner.release();
      throw new BadRequestException
    }
  }

  async findAll() {
    const sales= await this.salesRepository.findAll()
    return this.res.response('OK', 'Sales found.', sales, new Date())
  }

  async findOne(saleId: string) {
      const sale:Sale = await this.saleRepository.findOne(saleId,{relations:['sale_products']})
      //console.log(sale);
      const saleProducts:Sales_Products[]=sale.sale_products
      //console.log(saleProducts);
      const saleProductsIds:any[]=[]
      saleProducts.forEach((saleProduct)=>{
        const saleProductId={
          sale_productId:saleProduct.sale_productsId
        }
        saleProductsIds.push(saleProductId)
      })
      //console.log(saleProductsIds);
      let sale_products:Sales_Products[]=[]
      for (let index = 0; index < saleProductsIds.length; index++) {
        const saleProduct= await this.saleProductRepository.findOne(saleProductsIds[index].sale_productId,{relations:['products']})
        sale_products.push(saleProduct)
      }
      const saleN = await this.salesRepository.findOneById(sale_products,sale)
      return saleN
  }

  update(id: number, updateSaleDto: UpdateSaleDto) {
    return `This action updates a #${id} sale`;
  }

  remove(id: number) {
    return `This action removes a #${id} sale`;
  }
}
