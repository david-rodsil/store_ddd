import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  MinLength,
  MaxLength,
  IsArray,
  IsInt,
  IsPositive,
  IsNumber,
  Min,
  IsOptional,
  IsIn,
} from 'class-validator';

export class CreateProductDto {
  @ApiProperty({description:'Product code (unique)',nullable:false, minLength:1})
    @IsString()
    @MinLength(1)
    readonly productCode: string;

    @ApiProperty({description:'Product name', minLength:1})
    @IsString()
    @MinLength(1)
    readonly productName: string;

    @ApiProperty({description:'Product description', nullable:true})
    @IsString()
    @IsOptional()
    readonly productDescription?: string;

    @ApiProperty({description:'Product price',nullable:false})
    @IsNumber()
    @IsPositive()
    readonly productPrice: number;

    @ApiProperty({description:'Product cost',nullable:false})
    @IsNumber()
    @IsPositive()
    readonly productCost: number;

    @ApiProperty({description:'Product discount',nullable:true})
    @IsIn([10,20,0])
    @IsNumber()
    @IsOptional()
    readonly productDiscount?: number

    @ApiProperty({description:'Product in stock', nullable:true})
    @IsInt()
    @IsPositive()
    @IsOptional()
    readonly productStock?: number;

    @ApiProperty({description:'Product slug', nullable:true})
    @IsString()
    @IsOptional()
    readonly productSlug?: string;
}
