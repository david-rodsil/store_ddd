import { Sale } from 'src/sales/infraestructure/entities/sale.entity';
import { CreateSaleDto } from '../../application/dto/create-sale.dto';
export interface ISaleRepository{
    createSale(sale:Sale):Promise<Sale>
    findAll()
    findById(sale_product:any,sale:Sale)
}