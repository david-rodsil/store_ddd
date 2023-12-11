import { CreateSaleDto } from '../../application/dto/create-sale.dto';
export interface ISaleRepository{
    createSale(createSaleDto:CreateSaleDto):Promise<string>
    findAll()
    findOneById(saleId)
}