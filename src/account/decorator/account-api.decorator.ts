import { applyDecorators, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiBadRequestResponse } from '@nestjs/swagger';
import { messagesService } from 'src/common/messages/messages.service';

const getMsg = messagesService.getMessage;

interface AccountApiSwaggerOptions {
  operation: any;
  responseType?: any;
  httpStatus?: HttpStatus;
}

export const AccountApiSwagger = (options: AccountApiSwaggerOptions) => {
  const { operation, responseType, httpStatus = HttpStatus.OK } = options;
  
  const decorators = [
    ApiOperation({ summary: getMsg('swagger', 'account', operation, 'summary') }),
    ApiResponse({
      status: httpStatus,
      description: getMsg('swagger', 'account', operation, 'success'),
      type: responseType,
    }),
    ApiBadRequestResponse({ 
      description: getMsg('swagger', 'account', operation, 'failed') 
    })
  ];

  if (httpStatus !== HttpStatus.CREATED) {
    decorators.push(HttpCode(httpStatus));
  }

  return applyDecorators(...decorators);
}