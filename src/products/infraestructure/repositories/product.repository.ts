import { EntityRepository, Like, Repository, getRepository } from 'typeorm';
import { Product } from '../entities/product.entity';
import { IProductRepository } from 'src/products/domain/irepositories/iproduct.repository';
import { IProduct } from 'src/products/domain/ientities/iproduct.entity';

import { FindProductDto } from 'src/products/application/dto/find-product.dto';
import { isUUID } from 'class-validator';
import { BadRequestException, NotFoundException, Query } from '@nestjs/common';
import { UpdateProductDto } from 'src/products/application/dto/update-product.dto';

@EntityRepository(Product)
export class ProductRepository extends Repository<Product> implements IProductRepository {
  
  async createProduct(createProductDto): Promise<IProduct> {
    return await this.save(createProductDto);
  }
  
  async findAll(findProductDto: FindProductDto): Promise<IProduct[]> {
    const{sort="", by="" ,limit=50, offset=0 ,min=0,max=0} = findProductDto;

    let query =this.createQueryBuilder('tblProducts');

    //Paginacion
    query= query.skip(offset).take(limit)

    //Ordenar por nombre y precio
    if (sort=="name" && by=="asc")query.orderBy({['"Product_strName"']:'ASC'})
    if (sort=="name" && by=="desc")query.orderBy({['"Product_strName"']:'DESC'})
    if (sort=="price" && by=="asc")query.orderBy({['"Product_numPrice"']:'ASC'})
    if (sort=="price" && by=="desc")query.orderBy({['"Product_numPrice"']:'DESC'})
    
    //Buscar por rango de precio
    if (min!=0 && max!=0 && max>0 && min >0 && max>min) {
      query=query.andWhere('"Product_numPrice" <= :max',{max})
      query=query.andWhere('"Product_numPrice" >= :min',{min}) 
    }
      return await query.getMany();
  }

  async findOneById(term:String):Promise<IProduct[]>{
    let product:any;

    //Verificamos si es un uuid para buscar el producto por el mismo
    if (isUUID(term)) {
      product = await this.findOne({
        where:{
          productId:term
        }
      })
    }else{
      //Si no es un uuid buscamos el producto por el codigo de producto
      product = await this.find({
        productCode:Like(`%${term}%`)
      })
    }

    let productFind:[]=product

    //Si no se encuentran los productos por codigo o un producto por uuid se lanza un error
    if (!productFind || productFind.length == 0 ) {
      throw new NotFoundException(`Product with Id ${term} not found`);
    }else{
      return product;
    }
  }
  
  async updateProduct(productId:string,updateProductDto: UpdateProductDto): Promise<IProduct> {
      //Se construye un objeto con los datos recibidos
    const userProduct = {
      productId,    //Id
      ...updateProductDto   //Body
    };

    //Obtiene de la db el elemento con ese id y despues sobre ese elemento aplica los demas elementos recibidos(body), si no lo encuentra devuelve vacio
    const product = await this.preload(userProduct)

    if (!product) {throw new NotFoundException(`Product with id ${productId} not found`);}

    const queryRunner= this.manager.connection.createQueryRunner()
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {

      await queryRunner.manager.save(product)

      await queryRunner.commitTransaction();
      await queryRunner.release();

      return this.findOne(productId);
      
    } catch (error) {  
      await queryRunner.rollbackTransaction();
      await queryRunner.release();   
      throw new BadRequestException()
    }
  }

  async removeProduct(productId: string): Promise<String> {
       //Buscar producto
    const product = await this.findOne(productId)

    if (!product) {

      //Si el producto no se encontró
      throw new NotFoundException(`Product with id ${productId} not found`)

    }else{

      //Se realiza la operacion delete en la base de datos
      await this.remove(product)
      return `The product was delete`
    }
  }
}
