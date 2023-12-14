import { ValidationPipe as NestValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from 'src/common/pipes/parseCustom';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { HttpExceptionFilter } from './common/customResponse/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe(),
    new NestValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    stopAtFirstError: true,
    }),

    );
    //Swagger config
  const config = new DocumentBuilder()
  .setTitle('Store')
  .build();
const document = SwaggerModule.createDocument(app, config);
SwaggerModule.setup('api', app, document);

app.useGlobalFilters(new HttpExceptionFilter());
  await app.listen(3000);
}
bootstrap();
