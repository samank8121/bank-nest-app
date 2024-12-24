import { Injectable } from '@nestjs/common';

@Injectable()
export class SwaggerService {
  getHello(): string {
    return 'Hello World!';
  }
}
