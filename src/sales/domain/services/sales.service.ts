import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateSaleDto } from '../../application/dto/create-sale.dto';
import { CustomResponse, CustomResponseInterface } from 'src/common/customResponse/response';
import { InjectRepository } from '@nestjs/typeorm';
import { SaleRepository } from 'src/sales/infraestructure/repositories/sale.repository';
import { ISaleRepository } from '../irepositories/isale.repository';
import { ProductRepository } from 'src/products/infraestructure/repositories/product.repository';
import { Product } from 'src/products/infraestructure/entities/product.entity';
import { Sale } from 'src/sales/infraestructure/entities/sale.entity';
import { Sale_Products } from 'src/sales/infraestructure/entities/sale_products.entity';
import { IProductRepository } from 'src/products/domain/irepositories/iproduct.repository';
import { ISale_ProductsRepository } from '../irepositories/isale_products.repository';
import { PercentageDiscountService } from 'src/discount/percentage-discount.service';
import { CurrencyDiscountService } from 'src/discount/currency-discount.service';

@Injectable()
export class SalesService {
  
  private readonly res = new CustomResponse();

  constructor(
    
    @InjectRepository(SaleRepository)
    public readonly saleRepository: ISaleRepository,
    @InjectRepository(ProductRepository)
    public readonly productRepository: IProductRepository,
    @InjectRepository(Sale_Products)
    public readonly saleProductRepository: ISale_ProductsRepository,

    public readonly discountCurrency:CurrencyDiscountService,
    public readonly discountPercentage:PercentageDiscountService
  ) {}

  async create(createSaleDto: CreateSaleDto): Promise<CustomResponseInterface> {
      const queryRunner = await this.productRepository.createQueryRunner()
      await queryRunner.connect()
      await queryRunner.startTransaction();
      
      try {
        const products = createSaleDto.products;
        const sale = new Sale();
        let totalSale: number = 0;
        let totalProducts: number = 0;
        let listProducts = [];
    
      for (let index = 0; index < products.length; index++) {
        
        const product = await this.productRepository.findOneByCode(products[index].productCode)
        
        if (!product || product.productStock<1) {
          throw new BadRequestException(`Product nof found: ${product}`)
        }
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
      const discount_percentage=createSaleDto.discount_percentage;
      let discount=0;
      let discount_currency=createSaleDto.discount_currency;
      if (!discount_currency)discount_currency=0;

      if (!discount_percentage){
        discount = this.discountCurrency.calculateDiscount(totalSale,discount_currency);
      }else{
        discount=this.discountPercentage.calculateDiscount(totalSale,discount_percentage);
      }
      sale.saleTotal=totalSale-discount;
      sale.saleItems = totalProducts;
      sale.saleDiscount=discount;
      const saleProduct = await this.saleRepository.createSale(sale);
      
      //Se registra la venta en la tabla pivote
      listProducts.forEach(async (product, index) => {
        const sale_product = {
          sales: saleProduct,
          products: product,
          totalProducts: products[index].items,
        };
        
        await queryRunner.manager.save(Sale_Products, sale_product);
      });
      
      //Se ejecuta la transacción
      await queryRunner.commitTransaction();
      await queryRunner.release();
      
      return this.res.response('OK', 'Sale was created.', 'Success', new Date());
    
    } catch (error) {      
      await queryRunner.rollbackTransaction();
      await queryRunner.release();
      throw new BadRequestException('Sale could not be created') 
    }
    
  }

  async findAll():Promise<CustomResponseInterface>{
    const sales=await this.saleRepository.findAll()
    return this.res.response('OK', 'Sales found.', sales, new Date());
  }

  async findOne(saleId: string) {
    try {
    const sale = await this.saleRepository.findOneSale(saleId,'sale_products')    
    const saleProducts=sale.sale_products
    const saleProductsIds:any[]=[]
    saleProducts.forEach((saleProduct)=>{
      const saleProductId={
        sale_productId:saleProduct.sale_productsId
      }
      saleProductsIds.push(saleProductId)
    })
    let sale_products:Sale_Products[]=[]
    for (let index = 0; index < saleProductsIds.length; index++) {
      const saleProduct= await this.saleProductRepository.findOneSaleProducts(saleProductsIds[index].sale_productId,'products')
      sale_products.push(saleProduct)
    }
    const saleN = await this.saleRepository.findById(sale_products,sale)
    return saleN
    } catch (error) {
      throw new NotFoundException('Sale not found')
    }
    
}

}
