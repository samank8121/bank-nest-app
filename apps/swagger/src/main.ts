import { NestFactory } from '@nestjs/core';
import { SwaggerModule } from './swagger.module';

async function bootstrap() {
  const app = await NestFactory.create(SwaggerModule);
  await app.listen(process.env.port ?? 3000);
}
bootstrap();
