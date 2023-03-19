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
          case 'string.email':
            return `이메일 형식에 맞지 않습니다.`;
          case 'string.min':
            return '문자열은 최소 10자 이상이어야 합니다.';
          case 'string.max':
            return '문자열은 최대 20자 이하여야 합니다.';
          case 'any.required':
              return '필수항목이 입력되지 않았습니다.';
          case 'any.only':
            return '비밀번호가 일치하지 않습니다.';
          case 'string.pattern.base':
            return '비밀번호는 문자와 숫자가 포함되어야 하며 특수문자도 포함될 수 있습니다.';
          case 'string.length':
            return '휴대폰번호는 11자리여야 합니다.';
          case 'string.pattern':
            return '유효한 휴대폰번호 형식이 아닙니다.';
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
