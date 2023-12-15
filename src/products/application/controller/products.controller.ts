import {Controller, Get, Post, Body, Patch, Param, Delete, ValidationPipe, UsePipes, Query, ParseUUIDPipe} from '@nestjs/common';
import { ProductService } from '../../domain/services/products.service';
import { CreateProductDto } from '../dto/create-product.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { Product } from 'src/products/infraestructure/entities/product.entity';
import { FindProductDto } from '../dto/find-product.dto';
import { UpdateProductDto } from '../dto/update-product.dto';

@ApiTags('Products')
@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post('create')
  @ApiResponse({status:201, description:'Product was created', type:Product})
  @ApiResponse({status:400, description:'Bad request'})
  create(@Body() createProductDto: CreateProductDto) {
    return this.productService.create(createProductDto);
  }

  @Get()
  findAll(@Query() findProductDto:FindProductDto) {
    return this.productService.findAll(findProductDto);
  }

  @Get(':id')
  findOne(@Param('id') term: string){
    return this.productService.findById(term)
  }
  
  @Patch(':id')
  update(@Param('id',ParseUUIDPipe) productId: string, @Body() updateProductDto:UpdateProductDto){
    return this.productService.update(productId,updateProductDto)
  }

  @Delete(':id')
  remove(@Param('id',ParseUUIDPipe) productId: string){
    return this.productService.remove(productId)
  }
}
