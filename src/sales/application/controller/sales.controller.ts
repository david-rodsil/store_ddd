import { Controller, Get, Post, Body, Patch, Param, Delete, NotFoundException } from '@nestjs/common';
import { SalesService } from '../../domain/services/sales.service';
import { CreateSaleDto } from '../dto/create-sale.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Sales')
@Controller('sales')
export class SalesController {
  constructor(private readonly salesService: SalesService) {}

  @Post()
  @ApiResponse({status:201, description:'Sale was created',type:String})
  @ApiResponse({status:400, description:'Bad request'})
  async create(@Body() createSaleDto: CreateSaleDto) {
    return await this.salesService.create(createSaleDto);
  }

  @Get()
  findAll() {
    return this.salesService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.salesService.findOne(id);
  }

}
