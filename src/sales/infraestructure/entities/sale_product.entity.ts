import { Product } from "src/products/infraestructure/entities/product.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Sale } from "./sale.entity";

@Entity({name:'tblSales_Products'})
export class Sales_Products {

    @PrimaryGeneratedColumn('uuid',{name:"sale_products_uuid_id"})
    sale_productsId ?: string;

    @ManyToOne(()=>Sale,(sales)=>sales.sale_products,)
    @JoinColumn({name:"sale_uuid_id"})
    sales:Sale;

    @ManyToOne(()=>Product,(products)=>products.sale_products)
    @JoinColumn({name:"product_uuid_id"})
    products:Product;

    @Column({name:"Sale_Product_numTotal"})
    totalProducts:number
}