import { ApiProperty } from "@nestjs/swagger";
import { IsArray } from "class-validator";
import { Product } from "src/products/infraestructure/entities/product.entity";

export class CreateSaleDto {
    @ApiProperty({description:'Array of products',nullable:false})
    @IsArray()
    readonly products: Product[]
}
