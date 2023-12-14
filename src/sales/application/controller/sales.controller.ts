import { Controller, Get, Post, Body, Patch, Param, Delete, NotFoundException } from '@nestjs/common';
import { SalesService } from '../../domain/services/sales.service';
import { CreateSaleDto } from '../dto/create-sale.dto';
import { UpdateSaleDto } from '../dto/update-sale.dto';
import { ApiResponse } from '@nestjs/swagger';

@Controller('sales')
export class SalesController {
  res: any;
  constructor(private readonly salesService: SalesService) {}

  @Post()
  @ApiResponse({status:201, description:'Sale was created',type:String})
  @ApiResponse({status:400, description:'Bad request'})
  async create(@Body() createSaleDto: CreateSaleDto) {
    try {
      const createN = await this.salesService.create(createSaleDto);
      return this.res.response('OK', 'Sale was created.', createN, new Date())
    } catch (error) {
      
    }
  }

  @Get()
  findAll() {
    return this.salesService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      const findN = await this.salesService.findOne(id);
      return this.res.response('OK', 'Sale was found.', findN, new Date())
    } catch (error) {
      throw  new NotFoundException('No se encontro la venta')
    }
    
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSaleDto: UpdateSaleDto) {
    return this.salesService.update(+id, updateSaleDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.salesService.remove(+id);
  }
}
