import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsIn, IsNumber, IsOptional, IsPositive, IsString } from "class-validator";


export class FindProductDto{

    @ApiProperty({required:false, description:'How many rows do you need'})
    @IsPositive()
    @IsOptional()
    @Type(() => Number)
    readonly limit?: number;

    @ApiProperty({required:false, description:'How many rows do you want to skip'})
    @IsOptional()
    @Type(() => Number)
    readonly offset?: number;

    @ApiProperty({required:false,description:'Order by name or price'})
    @IsString()
    @IsOptional()
    @IsIn(['name','price'])
    readonly sort?: string;

    @ApiProperty({required:false,description:'Order by asc or desc'})
    @IsString()
    @IsOptional()
    @IsIn(['asc','desc'])
    readonly by?: string; 

    @ApiProperty({required:false,description:'Range minimum'})
    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    readonly min?: number;

    @ApiProperty({required:false,description:'Range maximum'})
    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    readonly max?: number;
}