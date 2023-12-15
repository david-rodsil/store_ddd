import { Sale_Products } from "src/sales/infraestructure/entities/sale_products.entity";

export interface ISale_ProductsRepository{
    findOneSaleProducts(saleProductId:string,relation:string)
}