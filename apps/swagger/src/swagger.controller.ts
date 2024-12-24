import { Controller, Get } from '@nestjs/common';
import { SwaggerService } from './swagger.service';

@Controller()
export class SwaggerController {
  constructor(private readonly swaggerService: SwaggerService) {}

  @Get()
  getHello(): string {
    return this.swaggerService.getHello();
  }
}
