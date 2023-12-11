import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ApiProperty } from "@nestjs/swagger";
import { ISale } from "src/sales/domain/ientities/isale.entity";
import { Sales_Products } from "./sale_product.entity";

@Entity({name:'tblSales'})
export class Sale implements ISale {

    @ApiProperty({
        example:'02b015ca-49eb-Coca cola',
        description:'Product ID',
        uniqueItems:true
    })
    @PrimaryGeneratedColumn('uuid',{name:"Sale_strId"})
    saleId : string;

    @ApiProperty({
        example:0,
        description:'Total sale',
    })
    @Column('numeric',{name:"Sale_numTotalSale"})
    saleTotal: number;

    @ApiProperty({
        example:0,
        description:'Total items sale',
    })
    @Column('numeric',{name:"Sale_numTotalProducts"})
    saleItems: number;

    @ApiProperty({
        example:'2023-11-13 15:19:37.477083',
        description:'Date and time of sale',
    })
    @Column({type:'timestamp', default:()=> 'CURRENT_TIMESTAMP',name:"Sale_dateDateTime"})
    saleTime: Date;

    @OneToMany(()=>Sales_Products, sales_products=>sales_products.sales,{cascade:true})
    sale_products: Sales_Products[]
}