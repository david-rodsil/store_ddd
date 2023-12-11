import { Injectable } from '@nestjs/common';
import { CreateSaleDto } from '../../application/dto/create-sale.dto';
import { UpdateSaleDto } from '../../application/dto/update-sale.dto';
import { CustomResponse, CustomResponseInterface } from 'src/common/customResponse/response';
import { InjectRepository } from '@nestjs/typeorm';
import { SaleRepository } from 'src/sales/infraestructure/repositories/isale.repository';
import { ISaleRepository } from '../irepositories/isale.repository';

@Injectable()
export class SalesService {
  
  private readonly res = new CustomResponse();


  constructor(
    @InjectRepository(SaleRepository)
    public readonly saleRepository: ISaleRepository,
  ) {}

  async create(createSaleDto: CreateSaleDto): Promise<CustomResponseInterface> {
    const saleN = await this.saleRepository.createSale(createSaleDto);
    return this.res.response('OK', 'Product was created.', saleN, new Date());
  }

  findAll() {
    return `This action returns all sales`;
  }

  findOne(id: number) {
    return `This action returns a #${id} sale`;
  }

  update(id: number, updateSaleDto: UpdateSaleDto) {
    return `This action updates a #${id} sale`;
  }

  remove(id: number) {
    return `This action removes a #${id} sale`;
  }
}
