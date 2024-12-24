/* eslint-disable @typescript-eslint/no-unused-vars */
import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';
import { ZodObject } from 'zod';

@Injectable()
export class ZodValidationPipe implements PipeTransform {
  constructor(private schemaFactory: () => ZodObject<any>) {}

  transform(value: any, metadata: ArgumentMetadata) {
    console.log('Raw value received:', value);
    const schema = this.schemaFactory();
    const dataToValidate = typeof value === 'string' ? JSON.parse(value) : value;
    try {
      console.log('ZodValidationPipe value', dataToValidate );
      schema.parse(dataToValidate);
      return value;
    } catch (error) {
      console.log('ZodValidationPipe error', error);
      throw error;
    }
  }
}
