export interface ISale_ProductsRepository{
    findOneSaleProducts(saleProductId:string,relation:string)
}