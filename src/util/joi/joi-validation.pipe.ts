import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import * as Joi from 'joi';

@Injectable()
export class JoiValidationPipe implements PipeTransform {
  constructor(private schema: Joi.ObjectSchema<any>) {}

  transform(value: any) {
    const { error } = this.schema.validate(value);
    if (error) {
      throw new BadRequestException(error.details[0].message);
    }
    return value;
  }

  transformException(exception: any) {
    if (exception instanceof Joi.ValidationError) {
      const errorMessage = exception.details.map((error) => {
        switch (error.type) {
          case 'any.required':
            return `${error.context.label} is required`;
          case 'string.email':
            return 'Invalid email address';
          default:
            return error.message;
        }
      });
      return new BadRequestException(errorMessage);
    }
    // 그 외의 예외는 원래의 예외를 반환
    return exception;
  }
}
