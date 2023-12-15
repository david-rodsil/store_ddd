import { Sale } from 'src/sales/infraestructure/entities/sale.entity';
import { ISale } from '../ientities/isale.entity';
export interface ISaleRepository{
    createSale(sale:Sale):Promise<ISale>
    findAll()
    findById(sale_product:any,sale:Sale)
    findOneSale(saleId:string,relation:string):Promise<Sale>
}