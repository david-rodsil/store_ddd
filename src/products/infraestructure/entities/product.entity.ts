import { ApiProperty } from '@nestjs/swagger';
import { IProduct } from 'src/products/domain/ientities/iproduct.entity';
import { Sales_Products } from 'src/sales/infraestructure/entities/sale_product.entity';
import {
  BeforeInsert,
  Check,
  ChildEntity,
  Column,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  TableInheritance,
} from 'typeorm';

@Entity({name:'tblProducts'})
@Check(`"Product_intStock" >= 0`)
export class Product implements IProduct{

    @ApiProperty({
        example:'02b015ca-49eb-Coca cola',
        description:'Product ID',
        uniqueItems:true
    })
    @PrimaryGeneratedColumn('uuid',{name:"Product_strId"})
    productId:string

    @ApiProperty({
        example:'Coca_cola_600',
        description:'Product Code',
        uniqueItems:true
    })
    @Column('text', {
        unique:true,
        name:"Product_strCode"
    })
    productCode:string

    @ApiProperty({
        example:'Coca cola',
        description:'Product name',
    })
    @Column('text',{name:"Product_strName"})
    productName:string

    @ApiProperty({
        example:'Bebida gaseosa en botella de plastico de 600 ml.',
        description:'Product description',
    })
    @Column('text',{nullable: true,name:"Product_strDescription"})
    productDescription:string

    @ApiProperty({
        example:0,
        description:'Product price',    })
    @Column('numeric',{name:"Product_numPrice"})
    productPrice: number

    @ApiProperty({
        example:0,
        description:'Product cost',
    })
    @Column('numeric',{name:"Product_numCost"})
    productCost: number
    
    @ApiProperty({
        example:0,
        description:'Product discount',
    })
    @Column('numeric',{name:"Product_numDiscount",default:0})
    productDiscount: number
    
    @ApiProperty({
        example:1,
        description:'Product stock',
    })
    @Column('int',{name:"Product_intStock",default:1})
    productStock: number

    @ApiProperty({
        example:'Coca_cola_details',
        description:'Product slug',
    })
    @Column('text',{name:"Product_strSlug",
        unique:true
    })
    productSlug: string

    items: number

    @OneToMany(()=>Sales_Products, sales_products=>sales_products.products)
    sale_products: Sales_Products[]
}

