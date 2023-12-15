import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsModule } from './products/products.module';
// import { HousesModule } from './houses/houses.module';
import { SalesModule } from './sales/sales.module';
import { DiscountModule } from './discount/discount.module';

@Module({
  imports: [
    ProductsModule,
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type:'postgres',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      database: process.env.DB_NAME,
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      autoLoadEntities: true,
      //Solo usar en desarrollo
      synchronize: true,
      entities: [
        __dirname + '/../../**/infrastructure/entities/*.entity.{js,ts}',
      ],
    }),
    SalesModule,
    DiscountModule],
})
export class AppModule {}
