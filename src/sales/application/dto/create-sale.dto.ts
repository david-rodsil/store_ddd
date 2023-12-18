import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsNumber, IsOptional, Max, Min } from "class-validator";
import { Product } from "src/products/infraestructure/entities/product.entity";

export class CreateSaleDto {
    @ApiProperty({description:'Array of products',nullable:false})
    @IsArray()
    readonly products: Product[]
    
    @ApiProperty({description:'Percentage discount'})
    @IsNumber()
    @IsOptional()
    @Min(1)
    @Max(100)
    readonly discount_percentage?:number;

    @ApiProperty({description:'Currency discount',default:0})
    @IsNumber()
    @IsOptional()
    @Min(1)
    readonly discount_currency?:number;
}
