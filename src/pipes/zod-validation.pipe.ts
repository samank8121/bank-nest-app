/* eslint-disable @typescript-eslint/no-unused-vars */
import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';
import { ZodObject } from 'zod';

@Injectable()
export class ZodValidationPipe implements PipeTransform {
  constructor(private schemaFactory: () => ZodObject<any>) {}

  transform(value: any, metadata: ArgumentMetadata) {
    const schema = this.schemaFactory();
    try {
      console.log('ZodValidationPipe value', value);
      schema.parse(value);
      return value;
    } catch (error) {
      console.log('ZodValidationPipe error', error);
      throw error;
    }
  }
}
