import { Test, TestingModule } from '@nestjs/testing';
import { SwaggerController } from './swagger.controller';
import { SwaggerService } from './swagger.service';

describe('SwaggerController', () => {
  let swaggerController: SwaggerController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [SwaggerController],
      providers: [SwaggerService],
    }).compile();

    swaggerController = app.get<SwaggerController>(SwaggerController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(swaggerController.getHello()).toBe('Hello World!');
    });
  });
});
