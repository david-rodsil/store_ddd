import { Product } from "src/products/infraestructure/entities/product.entity";
import { Sale } from "src/sales/infraestructure/entities/sale.entity";

export interface ISale_Products{
    sales:Sale;
    products:Product;
    totalProducts:number;
}